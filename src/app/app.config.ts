import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { authInterceptor } from "@/core/auth/interceptors/auth.interceptor";
import { errorInterceptor } from "@/core/interceptor/error.interceptor";
import { routes } from "./app.routes";
import { provideSignalFormsConfig } from "@angular/forms/signals";
import { NG_STATUS_CLASSES } from "@angular/forms/signals/compat";
import { loadingInterceptor } from "./core/interceptor/loading.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor, loadingInterceptor])),
    CookieService,
    provideSignalFormsConfig({ classes: NG_STATUS_CLASSES }),
  ],
};
