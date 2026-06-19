import { computed, effect, inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "@/env/environment";
import { Observable, tap } from "rxjs";
import { TokenStorageService } from "@/core/auth/services/token-storage.service";
import { Auth, AuthResponse } from "@/core/auth/models/auth.interface";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly baseUrl: string = environment.baseUrl + "/auth";
  private readonly http: HttpClient = inject(HttpClient);
  private readonly tokenService: TokenStorageService = inject(TokenStorageService);
  private readonly router: Router = inject(Router);

  readonly user$ = this.tokenService.user$;
  readonly isAuthenticated = computed(() => this.user$() !== null);
  readonly isRoleUser = this.tokenService.role$;

  constructor() {
    effect(() => {
      if (!this.isAuthenticated()) {
        this.router.navigate(["/login"]);
      }
    });
  }

  login(dto: Auth): Observable<AuthResponse> {
    const response = this.http.post<AuthResponse>(`${this.baseUrl}/login`, dto).pipe(
      tap((response) => {
        const expiresAt = new Date(Date.now() + response.expiresIn * 1000);
        this.tokenService.saveCookie(response, expiresAt);
        this.redirectUser();
      }),
    );

    return response;
  }

  redirectUser(): string {
    switch (this.isRoleUser()) {
      case "ADMIN USER":
        return "/admin/home";
      case "USER":
        return "/";
      default:
        return "/";
    }
  }

  getToken(): string | null {
    return this.tokenService.getUser()?.accessToken ?? null;
  }

  logout() {
    this.tokenService.logout();
  }

  decodedToken() {
    return this.tokenService.decodedToken();
  }
}
