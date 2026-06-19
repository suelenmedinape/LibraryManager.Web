import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { GenreService } from "./genre.service";
import { environment } from "@/env/environment";
import { GenreFilter, GenreInfoResponse, GenreCreateRequest, GenreUpdateRequest } from "@/shared/models/genre.interface";

describe("GenreService", () => {
  let service: GenreService;
  let httpTestingController: HttpTestingController;

  const mockGenres: GenreInfoResponse[] = [
    {
      id: 1,
      name: "Ficção Científica",
      createdAt: new Date("2026-06-19T10:00:00Z"),
      updatedAt: new Date("2026-06-19T10:00:00Z"),
    },
    {
      id: 2,
      name: "Fantasia",
      createdAt: new Date("2026-06-19T11:00:00Z"),
      updatedAt: new Date("2026-06-19T11:00:00Z"),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GenreService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(GenreService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("deve ser criado", () => {
    expect(service).toBeTruthy();
  });

  describe("findAll()", () => {
    it("deve retornar todos os gêneros com filtros aplicados", () => {
      const filter: GenreFilter = { name: "Ficção" };
      let result: GenreInfoResponse[] | undefined;

      service.findAll(filter).subscribe((res) => {
        result = res;
      });

      const req = httpTestingController.expectOne((request) => {
        return request.url === `${environment.baseUrl}/genres` && request.params.get("name") === "Ficção";
      });
      expect(req.request.method).toBe("GET");
      req.flush(mockGenres);

      expect(result).toEqual(mockGenres);
    });
  });

  describe("findById()", () => {
    it("deve retornar um gênero pelo ID", () => {
      const mockGenre = mockGenres[0];
      let result: GenreInfoResponse | undefined;

      service.findById(1).subscribe((res) => {
        result = res;
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/genres/1`);
      expect(req.request.method).toBe("GET");
      req.flush(mockGenre);

      expect(result).toEqual(mockGenre);
    });
  });

  describe("save()", () => {
    it("deve criar um novo gênero", () => {
      const dto: GenreCreateRequest = { name: "Terror" };
      const createdGenre: GenreInfoResponse = {
        id: 3,
        name: "Terror",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      let result: GenreInfoResponse | undefined;

      service.save(dto).subscribe((res) => {
        result = res;
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/genres`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(dto);
      req.flush(createdGenre);

      expect(result).toEqual(createdGenre);
    });
  });

  describe("update()", () => {
    it("deve atualizar um gênero existente", () => {
      const dto: GenreUpdateRequest = { name: "Fantasia Épica" };
      let updated = false;

      service.update(dto, 2).subscribe(() => {
        updated = true;
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/genres/2`);
      expect(req.request.method).toBe("PATCH");
      expect(req.request.body).toEqual(dto);
      req.flush(null);

      expect(updated).toBe(true);
    });
  });

  describe("delete()", () => {
    it("deve remover um gênero pelo ID", () => {
      let deleted = false;

      service.delete(1).subscribe(() => {
        deleted = true;
      });

      const req = httpTestingController.expectOne(`${environment.baseUrl}/genres/1`);
      expect(req.request.method).toBe("DELETE");
      req.flush(null);

      expect(deleted).toBe(true);
    });
  });
});
