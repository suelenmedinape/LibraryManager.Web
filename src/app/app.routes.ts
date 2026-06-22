import { Routes } from "@angular/router";
import { NotFoundComponent } from "./features/not-found/not-found.component";

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
    loadChildren: () => import("@/features/admin/admin.routes").then((r) => r.adminRoutes),
  },
  {
    path: "user",
    loadChildren: () => import("@/features/user/user.routes").then((r) => r.userRoutes),
  },
  { path: "404", component: NotFoundComponent },
  { path: "**", redirectTo: "404" },
];
