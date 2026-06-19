import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { signal } from "@angular/core";
import { AuthService } from "./auth.service";
import { TokenStorageService } from "./token-storage.service";
import { environment } from "@/env/environment";
import { Auth, AuthResponse } from "@/core/auth/models/auth.interface";

describe("AuthService", () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };
  let tokenServiceSpy: {
    user$: ReturnType<typeof signal>;
    role$: ReturnType<typeof signal>;
    saveCookie: ReturnType<typeof vi.fn>;
    getUser: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
    decodedToken: ReturnType<typeof vi.fn>;
  };

  const mockUserSignal = signal<AuthResponse | null>(null);
  const mockRoleSignal = signal<string | null>(null);

  beforeEach(() => {
    // Reset local signals
    mockUserSignal.set(null);
    mockRoleSignal.set(null);

    routerSpy = {
      navigate: vi.fn(),
    };

    tokenServiceSpy = {
      user$: mockUserSignal,
      role$: mockRoleSignal,
      saveCookie: vi.fn(),
      getUser: vi.fn(),
      logout: vi.fn(),
      decodedToken: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
        { provide: TokenStorageService, useValue: tokenServiceSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("deve ser criado", () => {
    expect(service).toBeTruthy();
  });

  describe("signals", () => {
    it("deve expor o user$ do TokenStorageService", () => {
      const mockUser: AuthResponse = { accessToken: "tk", tokenType: "Bearer", expiresIn: 3600 };
      mockUserSignal.set(mockUser);
      expect(service.user$()).toEqual(mockUser);
    });

    it("deve computar isAuthenticated corretamente", () => {
      expect(service.isAuthenticated()).toBe(false);

      const mockUser: AuthResponse = { accessToken: "tk", tokenType: "Bearer", expiresIn: 3600 };
      mockUserSignal.set(mockUser);
      expect(service.isAuthenticated()).toBe(true);
    });

    it("deve expor o role$ como isRoleUser", () => {
      mockRoleSignal.set("ADMIN USER");
      expect(service.isRoleUser()).toBe("ADMIN USER");
    });
  });

  describe("login()", () => {
    it("deve fazer requisição POST e salvar o cookie de autenticação no sucesso", () => {
      const authDto: Auth = { email: "user@test.com", password: "password" };
      const authResponse: AuthResponse = { accessToken: "new-token", tokenType: "Bearer", expiresIn: 3600 };

      const redirectSpy = vi.spyOn(service, "redirectUser").mockReturnValue("/");

      let result: AuthResponse | undefined;
      service.login(authDto).subscribe((res) => {
        result = res;
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/auth/login`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(authDto);

      req.flush(authResponse);

      expect(result).toEqual(authResponse);
      expect(tokenServiceSpy.saveCookie).toHaveBeenCalledWith(authResponse, expect.any(Date));
      expect(redirectSpy).toHaveBeenCalled();
    });
  });

  describe("redirectUser()", () => {
    it("deve retornar '/admin/home' se o usuário for ADMIN USER", () => {
      mockRoleSignal.set("ADMIN USER");
      expect(service.redirectUser()).toBe("/admin/home");
    });

    it("deve retornar '/' se o usuário for USER", () => {
      mockRoleSignal.set("USER");
      expect(service.redirectUser()).toBe("/");
    });

    it("deve retornar '/' por padrão se for outra role ou null", () => {
      mockRoleSignal.set("UNKNOWN");
      expect(service.redirectUser()).toBe("/");

      mockRoleSignal.set(null);
      expect(service.redirectUser()).toBe("/");
    });
  });

  describe("getToken()", () => {
    it("deve retornar o token de acesso se o usuário existir", () => {
      tokenServiceSpy.getUser.mockReturnValue({ accessToken: "access-token-123", tokenType: "Bearer", expiresIn: 3600 });
      expect(service.getToken()).toBe("access-token-123");
    });

    it("deve retornar null se o usuário não existir", () => {
      tokenServiceSpy.getUser.mockReturnValue(null);
      expect(service.getToken()).toBeNull();
    });
  });

  describe("logout()", () => {
    it("deve chamar o logout no TokenStorageService", () => {
      service.logout();
      expect(tokenServiceSpy.logout).toHaveBeenCalled();
    });
  });

  describe("decodedToken()", () => {
    it("deve chamar decodedToken no TokenStorageService", () => {
      const decodedPayload = { sub: "user@test.com" };
      tokenServiceSpy.decodedToken.mockReturnValue(decodedPayload);

      const result = service.decodedToken();
      expect(tokenServiceSpy.decodedToken).toHaveBeenCalled();
      expect(result).toEqual(decodedPayload);
    });
  });
});
