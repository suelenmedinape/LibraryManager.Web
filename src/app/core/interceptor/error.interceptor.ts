import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { catchError, throwError } from "rxjs";
import { Router } from "@angular/router";
import { AuthService } from "@/core/auth/services/auth.service";
import { environment } from "@/env/environment";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = "An unexpected error occurred";
      const timestamp = new Date().toISOString();

      if (environment.production) {
        console.error(
          `[${timestamp}] [HTTP Error] [${req.method}] ${req.url} - Status: ${error.status} ${error.message}`,
          error,
        );
      }

      if (error.status === 401) {
        errorMessage = "Session expired. Please log in again.";
        authService.logout();
        router.navigate(["/login"]);
        toastr.warning(errorMessage, "Session Expired");
      } else if (error.status === 403) {
        errorMessage = "You do not have permission to access this page.";
        router.navigate(["/"]);
        toastr.warning(errorMessage, "Access Denied");
      } else if (error.error instanceof ErrorEvent) {
        errorMessage = `Network/client error: ${error.error.message}`;
        toastr.error(errorMessage, "Error");
      } else if (error.status === 0) {
        errorMessage = "Unable to connect to the server. Please check your internet connection.";
        toastr.error(errorMessage, "Connection Error");
      } else if (error.status >= 500) {
        errorMessage = "Internal server error. Please try again later.";
        toastr.error(errorMessage, "Server Error");
      }

      return throwError(() => error);
    }),
  );
};
