import { Routes } from "@angular/router";
import { authGuard, userGuard } from "@/core/auth/guards/auth-guard";
import { UserLayoutComponent } from "../../layout/user-layout/user-layout.component";
import { userProfileResolver } from "@/core/resolvers/user-profile.resolver";
export const userRoutes: Routes = [
  {
    path: "",
    component: UserLayoutComponent,
    canActivate: [authGuard, userGuard],
    children: [
      {
        path: "",
        redirectTo: "catalog",
        pathMatch: "full",
      },
      {
        path: "catalog",
        loadComponent: () =>
          import("@/features/user/pages/catalog/catalog.component").then(
            (c) => c.CatalogComponent,
          ),
      },
      {
        path: "loans",
        loadComponent: () =>
          import("@/features/user/pages/my-loans/my-loans.component").then(
            (c) => c.MyLoansComponent,
          ),
      },
      {
        path: "profile",
        loadComponent: () =>
          import("@/features/user/pages/profile/profile.component").then(
            (c) => c.ProfileComponent,
          ),
        resolve: {
          userProfile: userProfileResolver,
        },
      },
    ],
  },
];
