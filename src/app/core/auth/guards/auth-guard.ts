import { AuthService } from "@/core/auth/services/auth.service";
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { GooeyToastService } from "ngx-gooey-toast";
import { UserRole } from "@/shared/enums/user-role";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(["/login"]);
    return false;
  }

  return true;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toastr = inject(GooeyToastService);
  const router = inject(Router);

  if (authService.isRoleUser() !== UserRole.ADMIN) {
    toastr.warning("Atenção!", { description: "Você não tem permissão para acessar essa pagina" });
    router.navigate([authService.redirectUser()]);
    return false;
  }

  return true;
};

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toastr = inject(GooeyToastService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(["/login"]);
    return false;
  }

  if (authService.isRoleUser() === UserRole.ADMIN) {
    toastr.warning("Atenção!", { description: "Administradores devem usar o painel admin" });
    router.navigate(["/admin/home"]);
    return false;
  }

  return true;
};
