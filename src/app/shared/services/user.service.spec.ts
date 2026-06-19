import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { UserService } from "./user.service";
import { environment } from "@/env/environment";
import { UserRole } from "@/shared/enums/user-role";
import {
  UserCreateRequest,
  UserCreateResponse,
  UserFilter,
  UserInfoResponse,
  UserUpdateRequest,
} from "@/shared/models/user.interface";

describe("UserService", () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  const mockUsers: UserInfoResponse[] = [
    {
      id: 1,
      fullName: "Administrador do Sistema",
      email: "admin@library.com",
      cpf: "12345678901",
      birthDate: new Date("1990-01-01"),
      role: UserRole.ADMIN,
      createdAt: new Date("2026-06-19T10:00:00Z"),
      updatedAt: new Date("2026-06-19T10:00:00Z"),
    },
    {
      id: 2,
      fullName: "João da Silva",
      email: "joao@example.com",
      cpf: "98765432100",
      birthDate: new Date("1995-05-15"),
      role: UserRole.USER,
      createdAt: new Date("2026-06-19T10:30:00Z"),
      updatedAt: new Date("2026-06-19T10:30:00Z"),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("deve ser criado", () => {
    expect(service).toBeTruthy();
  });

  describe("findAll()", () => {
    it("deve retornar todos os usuários filtrados", () => {
      const filter: UserFilter = { name: "João", role: UserRole.USER };
      let result: UserInfoResponse[] | undefined;

      service.findAll(filter).subscribe((res) => {
        result = res;
      });

      const req = httpTestingController.expectOne((request) => {
        return (
          request.url === `${environment.baseUrl}/users` &&
          request.params.get("name") === "João" &&
          request.params.get("role") === UserRole.USER
        );
      });
      expect(req.request.method).toBe("GET");
      req.flush(mockUsers);

      expect(result).toEqual(mockUsers);
    });
  });

  describe("findById()", () => {
    it("deve retornar um usuário específico pelo ID", () => {
      const mockUser = mockUsers[0];
      let result: UserInfoResponse | undefined;

      service.findById(1).subscribe((res) => {
        result = res;
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/users/1`);
      expect(req.request.method).toBe("GET");
      req.flush(mockUser);

      expect(result).toEqual(mockUser);
    });
  });

  describe("save()", () => {
    it("deve criar um novo usuário", () => {
      const dto: UserCreateRequest = {
        fullName: "Maria Oliveira",
        email: "maria@example.com",
        cpf: "11122233344",
        birthDate: new Date("1992-08-20"),
        role: UserRole.USER,
        password: "password123",
      };
      const createResponse: UserCreateResponse = {
        id: 3,
        fullName: "Maria Oliveira",
        email: "maria@example.com",
        role: UserRole.USER,
        createdAt: new Date(),
      };
      let result: UserCreateResponse | undefined;

      service.save(dto).subscribe((res) => {
        result = res;
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/users`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(dto);
      req.flush(createResponse);

      expect(result).toEqual(createResponse);
    });
  });

  describe("update()", () => {
    it("deve atualizar um usuário existente pelo ID", () => {
      const dto: UserUpdateRequest = { fullName: "João Silva Santos" };
      let updated = false;

      service.update(dto, 2).subscribe(() => {
        updated = true;
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/users/2`);
      expect(req.request.method).toBe("PATCH");
      expect(req.request.body).toEqual(dto);
      req.flush(null);

      expect(updated).toBe(true);
    });
  });

  describe("delete()", () => {
    it("deve remover um usuário pelo ID", () => {
      let deleted = false;

      service.delete(1).subscribe(() => {
        deleted = true;
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/users/1`);
      expect(req.request.method).toBe("DELETE");
      req.flush(null);

      expect(deleted).toBe(true);
    });
  });
});
