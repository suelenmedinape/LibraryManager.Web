import { signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { CanActivateFn, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "@/core/auth/services/auth.service";
import { authGuard, adminGuard } from "@/core/auth/guards/auth-guard";

// ─── Helpers ────────────────────────────────────────────────────────────────

const runGuard = (guard: CanActivateFn) =>
  TestBed.runInInjectionContext(() => guard({} as any, {} as any));

function mockAuthService(opts: {
  isAuthenticated: boolean;
  role?: string | null;
  redirectUrl?: string;
}) {
  return {
    isAuthenticated: signal(opts.isAuthenticated),
    isRoleUser: signal(opts.role ?? null),
    redirectUser: vi.fn().mockReturnValue(opts.redirectUrl ?? "/"),
  };
}

// ─── authGuard ──────────────────────────────────────────────────────────────

describe("authGuard", () => {
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    router = { navigate: vi.fn() };
  });

  describe("usuário autenticado", () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: AuthService, useValue: mockAuthService({ isAuthenticated: true }) },
          { provide: Router, useValue: router },
        ],
      });
    });

    it("permite a navegação (retorna true)", () => {
      expect(runGuard(authGuard)).toBe(true);
    });

    it("não redireciona para /login", () => {
      runGuard(authGuard);
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe("usuário não autenticado", () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: AuthService, useValue: mockAuthService({ isAuthenticated: false }) },
          { provide: Router, useValue: router },
        ],
      });
    });

    it("bloqueia a navegação (retorna false)", () => {
      expect(runGuard(authGuard)).toBe(false);
    });

    it("redireciona para /login", () => {
      runGuard(authGuard);
      expect(router.navigate).toHaveBeenCalledWith(["/login"]);
    });
  });
});

// ─── adminGuard ─────────────────────────────────────────────────────────────

describe("adminGuard", () => {
  let router: { navigate: ReturnType<typeof vi.fn> };
  let toastr: { warning: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    router = { navigate: vi.fn() };
    toastr = { warning: vi.fn() };
  });

  describe("usuário com role Admin", () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: AuthService,
            useValue: mockAuthService({ isAuthenticated: true, role: "Admin" }),
          },
          { provide: Router, useValue: router },
          { provide: ToastrService, useValue: toastr },
        ],
      });
    });

    it("permite a navegação (retorna true)", () => {
      expect(runGuard(adminGuard)).toBe(true);
    });

    it("não exibe toast de aviso", () => {
      runGuard(adminGuard);
      expect(toastr.warning).not.toHaveBeenCalled();
    });

    it("não redireciona", () => {
      runGuard(adminGuard);
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe("usuário com role User (não Admin)", () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: AuthService,
            useValue: mockAuthService({ isAuthenticated: true, role: "User", redirectUrl: "/" }),
          },
          { provide: Router, useValue: router },
          { provide: ToastrService, useValue: toastr },
        ],
      });
    });

    it("bloqueia a navegação (retorna false)", () => {
      expect(runGuard(adminGuard)).toBe(false);
    });

    it("exibe toast de aviso de permissão", () => {
      runGuard(adminGuard);
      expect(toastr.warning).toHaveBeenCalledWith(
        "Você não tem permissão para acessar essa pagina",
        "Atenção!",
      );
    });

    it("redireciona para a rota retornada por redirectUser()", () => {
      runGuard(adminGuard);
      expect(router.navigate).toHaveBeenCalledWith(["/"]);
    });
  });

  describe("usuário não autenticado (role null)", () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: AuthService,
            useValue: mockAuthService({
              isAuthenticated: false,
              role: null,
              redirectUrl: "/login",
            }),
          },
          { provide: Router, useValue: router },
          { provide: ToastrService, useValue: toastr },
        ],
      });
    });

    it("bloqueia a navegação (retorna false)", () => {
      expect(runGuard(adminGuard)).toBe(false);
    });

    it("redireciona para /login via redirectUser()", () => {
      runGuard(adminGuard);
      expect(router.navigate).toHaveBeenCalledWith(["/login"]);
    });
  });
});
