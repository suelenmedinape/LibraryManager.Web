import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "../../layout/admin-layout/admin-layout.component";
import { adminGuard, authGuard } from "@/core/auth/guards/auth-guard";

export const adminRoutes: Routes = [
  {
    path: "",
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
      {
        path: "books",
        loadComponent: () =>
          import("@/features/admin/pages/books/books.component").then((a) => a.BooksComponent),
      },
      {
        path: "genres",
        loadComponent: () =>
          import("@/features/admin/pages/genres/genres.component").then((g) => g.GenresComponent),
      },
      {
        path: "users",
        loadComponent: () =>
          import("@/features/admin/pages/users/users.component").then((u) => u.UsersComponent),
      },
      {
        path: "loans",
        loadComponent: () =>
          import("@/features/admin/pages/loans/loans.component").then((l) => l.LoansComponent),
      },
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
      },
    ],
  },
];
