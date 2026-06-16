import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { provideToastr } from "ngx-toastr";
import { authInterceptor } from "@/core/auth/interceptors/auth.interceptor";
import { errorInterceptor } from "@/core/interceptor/error.interceptor";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    CookieService,
    provideToastr(),
  ],
};
