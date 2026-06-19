import { TestBed } from "@angular/core/testing";
import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { authInterceptor } from "./auth.interceptor";
import { AuthService } from "@/core/auth/services/auth.service";

describe("authInterceptor", () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authServiceSpy: {
    getToken: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    authServiceSpy = {
      getToken: vi.fn().mockReturnValue(null),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("deve adicionar o cabeçalho Authorization se o token estiver presente", () => {
    authServiceSpy.getToken.mockReturnValue("fake-token-123");

    httpClient.get("/test").subscribe();

    const req = httpMock.expectOne("/test");
    expect(req.request.headers.has("Authorization")).toBe(true);
    expect(req.request.headers.get("Authorization")).toBe("Bearer fake-token-123");
  });

  it("não deve adicionar o cabeçalho Authorization se o token não estiver presente", () => {
    authServiceSpy.getToken.mockReturnValue(null);

    httpClient.get("/test").subscribe();

    const req = httpMock.expectOne("/test");
    expect(req.request.headers.has("Authorization")).toBe(false);
  });
});
