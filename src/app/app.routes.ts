import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("@/core/auth/pages/login/login.component").then((l) => l.LoginComponent),
  },
];
