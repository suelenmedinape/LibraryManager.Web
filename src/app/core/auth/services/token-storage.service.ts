import { AuthResponse, TokenFormat } from "@/core/auth/models/auth.interface";
import { environment } from "@/env/environment.development";
import { inject, Injectable, signal } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root",
})
export class TokenStorageService {
  private readonly cookieService: CookieService = inject(CookieService);
  private readonly key = environment.keyToken;

  readonly user$ = signal<AuthResponse | null>(this.getUser());
  readonly role$ = signal<string | null>(this.getRole());

  saveCookie(user: AuthResponse, exp: Date) {
    this.user$.set(user);
    this.cookieService.set(this.key, JSON.stringify(user), { expires: exp });
  }

  getUser(): AuthResponse | null {
    const raw = this.cookieService.get(this.key);
    if (!raw) return null;
    
    try {
      return JSON.parse(raw) as AuthResponse;
    } catch {
      return null;
    }
  }

  getRole(): string | null {
    const raw = this.cookieService.get(this.key);
    if (!raw) return null;
    try {
      const user = JSON.parse(raw) as AuthResponse;
      const decoded = this.decodedToken(user);
      return decoded?.scope ?? null;
    } catch {
      return null;
    }
  }

  decodedToken(tk?: AuthResponse): TokenFormat | null {
    const token = tk?.accessToken ?? this.getUser()?.accessToken;
    if (!token) return null;
    return jwtDecode(token);
  }

  logout() {
    if (!this.cookieService.check(this.key)) return;
    this.user$.set(null);
    this.cookieService.delete(this.key);
  }
}
