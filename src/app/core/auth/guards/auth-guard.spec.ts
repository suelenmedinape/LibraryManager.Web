import { signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { CanActivateFn, Router } from "@angular/router";
import { GooeyToastService } from "ngx-gooey-toast";
import { AuthService } from "@/core/auth/services/auth.service";
import { authGuard, adminGuard, userGuard } from "@/core/auth/guards/auth-guard";
import { UserRole } from "@/shared/enums/user-role";

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
            useValue: mockAuthService({ isAuthenticated: true, role: UserRole.ADMIN }),
          },
          { provide: Router, useValue: router },
          { provide: GooeyToastService, useValue: toastr },
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
            useValue: mockAuthService({ isAuthenticated: true, role: UserRole.USER, redirectUrl: "/" }),
          },
          { provide: Router, useValue: router },
          { provide: GooeyToastService, useValue: toastr },
        ],
      });
    });

    it("bloqueia a navegação (retorna false)", () => {
      expect(runGuard(adminGuard)).toBe(false);
    });

    it("exibe toast de aviso de permissão", () => {
      runGuard(adminGuard);
      expect(toastr.warning).toHaveBeenCalledWith("Atenção!", {
        description: "Você não tem permissão para acessar essa pagina",
      });
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
          { provide: GooeyToastService, useValue: toastr },
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

// ─── userGuard ──────────────────────────────────────────────────────────────

describe("userGuard", () => {
  let router: { navigate: ReturnType<typeof vi.fn> };
  let toastr: { warning: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    router = { navigate: vi.fn() };
    toastr = { warning: vi.fn() };
  });

  describe("usuário com role User (Leitor)", () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: AuthService,
            useValue: mockAuthService({ isAuthenticated: true, role: UserRole.USER }),
          },
          { provide: Router, useValue: router },
          { provide: GooeyToastService, useValue: toastr },
        ],
      });
    });

    it("permite a navegação (retorna true)", () => {
      expect(runGuard(userGuard)).toBe(true);
    });

    it("não redireciona", () => {
      runGuard(userGuard);
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe("usuário com role Admin", () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: AuthService,
            useValue: mockAuthService({ isAuthenticated: true, role: UserRole.ADMIN }),
          },
          { provide: Router, useValue: router },
          { provide: GooeyToastService, useValue: toastr },
        ],
      });
    });

    it("bloqueia a navegação (retorna false)", () => {
      expect(runGuard(userGuard)).toBe(false);
    });

    it("exibe toast de aviso de que admins devem usar o painel admin", () => {
      runGuard(userGuard);
      expect(toastr.warning).toHaveBeenCalledWith("Atenção!", {
        description: "Administradores devem usar o painel admin",
      });
    });

    it("redireciona para /admin/home", () => {
      runGuard(userGuard);
      expect(router.navigate).toHaveBeenCalledWith(["/admin/home"]);
    });
  });

  describe("usuário não autenticado", () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: AuthService,
            useValue: mockAuthService({ isAuthenticated: false, role: null }),
          },
          { provide: Router, useValue: router },
          { provide: GooeyToastService, useValue: toastr },
        ],
      });
    });

    it("bloqueia a navegação (retorna false)", () => {
      expect(runGuard(userGuard)).toBe(false);
    });

    it("redireciona para /login", () => {
      runGuard(userGuard);
      expect(router.navigate).toHaveBeenCalledWith(["/login"]);
    });
  });
});
