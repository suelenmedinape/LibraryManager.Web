import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { UserService } from "@/shared/services/user.service";
import { AuthService } from "@/core/auth/services/auth.service";
import { UserInfoResponse } from "@/shared/models/user.interface";
import { catchError, of } from "rxjs";
import { GooeyToastService } from "ngx-gooey-toast";

export const userProfileResolver: ResolveFn<UserInfoResponse | null> = () => {
  const authService = inject(AuthService);
  const userService = inject(UserService);
  const toastr = inject(GooeyToastService);
  
  const userId = authService.decodedToken()?.userId;

  if (!userId) {
    toastr.error("Usuário não autenticado");
    return of(null);
  }

  return userService.findById(+userId).pipe(
    catchError(() => {
      toastr.error("Erro ao carregar dados do perfil");
      return of(null);
    })
  );
};
