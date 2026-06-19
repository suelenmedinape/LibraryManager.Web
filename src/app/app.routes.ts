import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./layout/admin-layout/admin-layout.component";
import { adminGuard, authGuard } from "@/core/auth/guards/auth-guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadComponent: () =>
      import("@/core/auth/pages/login/login.component").then((l) => l.LoginComponent),
  },
  {
    path: "admin",
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: "home",
        loadComponent: () =>
          import("@/features/admin/pages/admin-home/admin-home.component").then(
            (a) => a.AdminHomeComponent,
          ),
      },
    ],
  },
];
