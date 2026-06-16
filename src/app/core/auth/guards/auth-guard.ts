import { AuthService } from "@/core/auth/services/auth.service";
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

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
  const toastr = inject(ToastrService);
  const router = inject(Router);

  if (authService.isRoleUser() !== "Admin") {
    toastr.warning("Você não tem permissão para acessar essa pagina", "Atenção!");
    router.navigate([authService.redirectUser()]);
    return false;
  }

  return true;
};
