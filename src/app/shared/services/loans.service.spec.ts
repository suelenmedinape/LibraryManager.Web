import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { LoansService } from "./loans.service";
import { environment } from "@/env/environment";
import { LoanStatus } from "@/shared/enums/loan-status";
import {
  LoanFilter,
  LoanInfoResponse,
  LoanHistoryResponse,
  LoanCreateRequest,
  LoanCreateResponse,
  LoanReturnRequest,
} from "@/shared/models/loan.interface";

describe("LoansService", () => {
  let service: LoansService;
  let httpTestingController: HttpTestingController;

  const mockUserBasic = { id: 1, fullName: "Fulano de Tal", email: "fulano@example.com" };
  const mockBookBasic = { id: 10, title: "Livro Teste", author: "Autor Teste" };

  const mockLoans: LoanInfoResponse[] = [
    {
      id: 1,
      user: mockUserBasic,
      book: mockBookBasic,
      status: LoanStatus.BORROWED,
      renewed: false,
      borrowedAt: new Date("2026-06-19T10:00:00Z"),
      dueAt: new Date("2026-06-26T10:00:00Z"),
      returnedAt: null,
      createdAt: new Date("2026-06-19T10:00:00Z"),
      updatedAt: new Date("2026-06-19T10:00:00Z"),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoansService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(LoansService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("deve ser criado", () => {
    expect(service).toBeTruthy();
  });

  describe("findAll()", () => {
    it("deve retornar todos os empréstimos aplicando filtros", () => {
      const filter: LoanFilter = { userId: 1, status: LoanStatus.BORROWED };
      let result: LoanInfoResponse[] | undefined;

      service.findAll(filter).subscribe((res) => {
        result = res;
      });

      const req = httpTestingController.expectOne((request) => {
        return (
          request.url === `${environment.baseUrl}/loans` &&
          request.params.get("userId") === "1" &&
          request.params.get("status") === LoanStatus.BORROWED
        );
      });
      expect(req.request.method).toBe("GET");
      req.flush(mockLoans);

      expect(result).toEqual(mockLoans);
    });
  });

  describe("findById()", () => {
    it("deve retornar um empréstimo específico por ID", () => {
      const mockLoan = mockLoans[0];
      let result: LoanInfoResponse | undefined;

      service.findById(1).subscribe((res) => {
        result = res;
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/loans/1`);
      expect(req.request.method).toBe("GET");
      req.flush(mockLoan);

      expect(result).toEqual(mockLoan);
    });
  });

  describe("findMyHistory()", () => {
    it("deve retornar o histórico do usuário autenticado", () => {
      const mockHistory: LoanHistoryResponse[] = [
        {
          id: 1,
          book: mockBookBasic,
          status: LoanStatus.RETURNED,
          renewed: false,
          borrowedAt: new Date("2026-06-19T10:00:00Z"),
          dueAt: new Date("2026-06-26T10:00:00Z"),
          returnedAt: new Date("2026-06-20T10:00:00Z"),
        },
      ];
      let result: LoanHistoryResponse[] | undefined;

      service.findMyHistory().subscribe((res) => {
        result = res;
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/loans/my-history`);
      expect(req.request.method).toBe("GET");
      req.flush(mockHistory);

      expect(result).toEqual(mockHistory);
    });
  });

  describe("save()", () => {
    it("deve criar um novo empréstimo", () => {
      const dto: LoanCreateRequest = { userId: 1, bookId: 10, borrowedAt: new Date() };
      const createResponse: LoanCreateResponse = {
        id: 2,
        user: mockUserBasic,
        book: mockBookBasic,
        status: LoanStatus.BORROWED,
        borrowedAt: dto.borrowedAt,
        dueAt: new Date(),
        createdAt: new Date(),
      };
      let result: LoanCreateResponse | undefined;

      service.save(dto).subscribe((res) => {
        result = res;
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/loans`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(dto);
      req.flush(createResponse);

      expect(result).toEqual(createResponse);
    });
  });

  describe("renew()", () => {
    it("deve renovar um empréstimo pelo ID", () => {
      let renewed = false;

      service.renew(1).subscribe(() => {
        renewed = true;
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/loans/1/renew`);
      expect(req.request.method).toBe("PATCH");
      expect(req.request.body).toEqual({});
      req.flush(null);

      expect(renewed).toBe(true);
    });
  });

  describe("finalize()", () => {
    it("deve finalizar/devolver um empréstimo", () => {
      const returnRequest: LoanReturnRequest = { returnedAt: new Date() };
      let finalized = false;

      service.finalize(1, returnRequest).subscribe(() => {
        finalized = true;
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/loans/1/return`);
      expect(req.request.method).toBe("PATCH");
      expect(req.request.body).toEqual(returnRequest);
      req.flush(null);

      expect(finalized).toBe(true);
    });
  });

  describe("lost()", () => {
    it("deve marcar o empréstimo como perdido", () => {
      let lost = false;

      service.lost(1).subscribe(() => {
        lost = true;
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/loans/1/lost`);
      expect(req.request.method).toBe("PATCH");
      expect(req.request.body).toEqual({});
      req.flush(null);

      expect(lost).toBe(true);
    });
  });

  describe("cancel()", () => {
    it("deve cancelar o empréstimo pelo ID", () => {
      let cancelled = false;

      service.cancel(1).subscribe(() => {
        cancelled = true;
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/loans/1/cancel`);
      expect(req.request.method).toBe("PATCH");
      expect(req.request.body).toEqual({});
      req.flush(null);

      expect(cancelled).toBe(true);
    });
  });
});
