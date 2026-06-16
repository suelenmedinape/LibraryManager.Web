import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { BookInfoResponse, BookFilter } from "@/features/books/models/books.interface";
import { BookService } from "@/features/books/services/book.service";

describe("BooksService", () => {
  let service: BookService;
  let httpTestingController: HttpTestingController;

  const fakeBooks: BookInfoResponse[] = [
    {
      id: 1,
      title: "Capitães da Areial",
      author: "Jorge Amado",
      publisher: "Companhia das Letras",
      year: 2008,
      edition: 1,
      isbn: "9788535911695",
      genres: [
        {
          id: 1,
          name: "Romance",
        },
      ],
      createdAt: new Date("2026-06-10T16:47:21.737704"),
      updatedAt: new Date("2026-06-11T10:58:36.826819"),
    },
  ];

  const filter: BookFilter = {
    title: "Cap",
    author: "Jorg",
    publisher: "Compa",
    year: 2008,
    edition: 1,
    isbn: "9788535",
    genreName: "Romanc",
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(), // moq de requisições http
      ],
    });
    service = TestBed.inject(BookService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  function expectBooksRequest() {
    return httpTestingController.expectOne(
      (request) => request.method === "GET" && request.url.endsWith("/books"),
    );
  }

  /* FINDALL */
  it("deve retornar todos os livros quando nenhum filtro for informado", () => {
    let result: BookInfoResponse[] | null = null;
    const filter: BookFilter = {};

    service.findAll(filter).subscribe((books) => {
      result = books;
    });

    const req = expectBooksRequest();
    req.flush(fakeBooks);

    expect(result).toEqual(fakeBooks);
  });

  it("deve enviar os filtros corretamente", () => {
    let result: BookInfoResponse[] | null = null;

    service.findAll(filter).subscribe((books) => {
      result = books;
    });

    const req = expectBooksRequest();
    req.flush(fakeBooks);

    expect(req.request.params.get("title")).toBe("Cap");
    expect(req.request.params.get("author")).toBe("Jorg");
    expect(req.request.params.get("publisher")).toBe("Compa");
    expect(req.request.params.get("year")).toBe("2008");
    expect(req.request.params.get("edition")).toBe("1");
    expect(req.request.params.get("isbn")).toBe("9788535");
    expect(req.request.params.get("genreName")).toBe("Romanc");

    expect(req.request.params.keys().length).toBe(7);
  });

  it("deve retornar os livros encontrados a partir dos filtros", () => {
    let result: BookInfoResponse[] | null = null;

    service.findAll(filter).subscribe((books) => {
      result = books;
    });

    const req = expectBooksRequest();
    req.flush(fakeBooks);

    expect(req.request.method).toBe("GET");
    expect(result).toEqual(fakeBooks);
  });
});
