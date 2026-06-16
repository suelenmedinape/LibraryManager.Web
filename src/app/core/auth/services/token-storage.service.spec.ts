import { AuthResponse } from "@/core/auth/models/auth.interface";
import { TokenStorageService } from "@/core/auth/services/token-storage.service";
import { TestBed } from "@angular/core/testing";
import { CookieService } from "ngx-cookie-service";

// JWT com payload: { iss, sub, exp, iat, userId: 1, scope: 'Admin' }
const MOCK_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJpc3MiOiJhcGkiLCJzdWIiOiJ1c2VyQHRlc3QuY29tIiwiZXhwIjo5OTk5OTk5OTk5LCJpYXQiOjAsInVzZXJJZCI6MSwic2NvcGUiOiJBZG1pbiJ9." +
  "signature";

const MOCK_USER: AuthResponse = {
  accessToken: MOCK_TOKEN,
  tokenType: "Bearer",
  expiresIn: 9999999999,
};

describe("TokenStorageService", () => {
  let service: TokenStorageService;
  let cookieSpy: {
    get: ReturnType<typeof vi.fn>;
    set: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    check: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    cookieSpy = {
      get: vi.fn().mockReturnValue(""),
      set: vi.fn(),
      delete: vi.fn(),
      check: vi.fn().mockReturnValue(false),
    };

    TestBed.configureTestingModule({
      providers: [TokenStorageService, { provide: CookieService, useValue: cookieSpy }],
    });

    service = TestBed.inject(TokenStorageService);
  });

  it("deve ser criado", () => {
    expect(service).toBeTruthy();
  });

  // ─── getUser ──────────────────────────────────────────────────────────────

  describe("getUser()", () => {
    it("retorna null quando o cookie está vazio", () => {
      cookieSpy.get.mockReturnValue("");
      expect(service.getUser()).toBeNull();
    });

    it("retorna o AuthResponse quando o cookie é válido", () => {
      cookieSpy.get.mockReturnValue(JSON.stringify(MOCK_USER));
      expect(service.getUser()).toEqual(MOCK_USER);
    });

    it("retorna null quando o cookie contém JSON inválido", () => {
      cookieSpy.get.mockReturnValue("isso-nao-e-json");
      expect(service.getUser()).toBeNull();
    });
  });

  // ─── getRole ──────────────────────────────────────────────────────────────

  describe("getRole()", () => {
    it("retorna null quando não há cookie", () => {
      cookieSpy.get.mockReturnValue("");
      expect(service.getRole()).toBeNull();
    });

    // ⚠️ Este teste vai FALHAR no código atual.
    // getRole() retorna user.accessToken em vez do scope decodificado.
    // Corrija getRole() para: return this.decodedToken(user)?.scope ?? null;
    it("retorna a role (scope) decodificada do JWT", () => {
      cookieSpy.get.mockReturnValue(JSON.stringify(MOCK_USER));
      expect(service.getRole()).toBe("Admin");
    });

    it("retorna null quando o cookie contém JSON inválido", () => {
      cookieSpy.get.mockReturnValue("invalido");
      expect(service.getRole()).toBeNull();
    });
  });

  // ─── saveCookie ───────────────────────────────────────────────────────────

  describe("saveCookie()", () => {
    it("chama cookieService.set com os parâmetros corretos", () => {
      const exp = new Date("2099-01-01");
      service.saveCookie(MOCK_USER, exp);

      expect(cookieSpy.set).toHaveBeenCalledWith(expect.any(String), JSON.stringify(MOCK_USER), {
        expires: exp,
      });
    });

    it("atualiza o signal user$ com o novo usuário", () => {
      const exp = new Date("2099-01-01");
      service.saveCookie(MOCK_USER, exp);
      expect(service.user$()).toEqual(MOCK_USER);
    });
  });

  // ─── decodedToken ─────────────────────────────────────────────────────────

  describe("decodedToken()", () => {
    it("retorna null quando não há token no cookie", () => {
      cookieSpy.get.mockReturnValue("");
      expect(service.decodedToken()).toBeNull();
    });

    it("decodifica o token do cookie quando nenhum argumento é passado", () => {
      cookieSpy.get.mockReturnValue(JSON.stringify(MOCK_USER));
      const decoded = service.decodedToken();
      expect(decoded?.scope).toBe("Admin");
      expect(decoded?.userId).toBe(1);
    });

    it("decodifica o token passado como argumento sem depender do cookie", () => {
      cookieSpy.get.mockReturnValue("");
      const decoded = service.decodedToken(MOCK_USER);
      expect(decoded?.scope).toBe("Admin");
    });
  });

  // ─── logout ───────────────────────────────────────────────────────────────

  describe("logout()", () => {
    it("deleta o cookie e limpa o signal user$", () => {
      cookieSpy.check.mockReturnValue(true);
      service.saveCookie(MOCK_USER, new Date("2099-01-01"));

      service.logout();

      expect(cookieSpy.delete).toHaveBeenCalled();
      expect(service.user$()).toBeNull();
    });

    it("não chama delete quando o cookie não existe", () => {
      cookieSpy.check.mockReturnValue(false);
      service.logout();
      expect(cookieSpy.delete).not.toHaveBeenCalled();
    });
  });

  // ─── signals ──────────────────────────────────────────────────────────────

  describe("signals iniciais", () => {
    it("user$ começa null quando não há cookie", () => {
      expect(service.user$()).toBeNull();
    });

    it("role$ começa null quando não há cookie", () => {
      expect(service.role$()).toBeNull();
    });
  });
});
