import { computed, inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "@/env/environment";
import { Observable, tap } from "rxjs";
import { TokenStorageService } from "@/core/auth/services/token-storage.service";
import { Auth, AuthResponse } from "@/core/auth/models/auth.interface";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly baseUrl: string = environment.baseUrl + "/auth";
  private readonly http: HttpClient = inject(HttpClient);
  private readonly tokenService: TokenStorageService = inject(TokenStorageService);

  readonly user$ = this.tokenService.user$;
  readonly isAuthenticated = computed(() => this.user$() !== null);
  readonly isRoleUser = this.tokenService.role$;

  login(dto: Auth): Observable<AuthResponse> {
    const response = this.http.post<AuthResponse>(`${this.baseUrl}/login`, dto).pipe(
      tap((response) => {
        const expiresAt = new Date(response.expiresIn * 1000);
        this.tokenService.saveCookie(response, expiresAt);
      }),
    );

    return response;
  }

  redirectUser(): string {
    switch (this.isRoleUser()) {
      case "Admin":
        return "/";
      case "User":
        return "/";
      default:
        return "/login";
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
