import { Component, computed, effect, inject, signal } from "@angular/core";
import { HeaderComponent } from "../../components/header/header.component";
import { TableBooksComponent } from "./components/table-books/table-books.component";
import { GooeyToastService } from "ngx-gooey-toast";
import { BookService } from "@/shared/services/book.service";
import { rxResource } from "@angular/core/rxjs-interop";
import { GenreBasicResponse } from "@/shared/models/genre.interface";
import { SearchField } from "@/features/admin/pages/books/types/search-field";
import { GenreService } from "@/shared/services/genre.service";
import { BookFilter, BookInfoResponse, BookCreateRequest } from "@/shared/models/books.interface";
import { HttpErrorResponse } from "@angular/common/http";
import { debouncedSignal } from "@/shared/utils/signal.utils";
import { ConfirmModalComponent } from "@/shared/components/confirm-modal/confirm-modal.component";
import { BookModalComponent } from "./components/book-modal/book-modal.component";

@Component({
  selector: "app-books",
  imports: [HeaderComponent, TableBooksComponent, ConfirmModalComponent, BookModalComponent],
  templateUrl: "./books.component.html",
  styleUrl: "./books.component.scss",
})
export class BooksComponent {
  private readonly toastr = inject(GooeyToastService);
  private readonly bookService = inject(BookService);
  private readonly genreService = inject(GenreService);

  readonly SearchField = SearchField;

  readonly genres = signal<GenreBasicResponse[]>([]);
  readonly searchField = signal<SearchField>(SearchField.TITLE);
  readonly searchValue = signal<string>("");
  readonly genreFilter = signal<string>("");

  // Modals Visibility
  readonly showAddModal = signal<boolean>(false);
  readonly showEditModal = signal<boolean>(false);
  readonly showDeleteModal = signal<boolean>(false);
  readonly selectedBook = signal<BookInfoResponse | null>(null);

  // debounce só no texto digitado — select não precisa
  private readonly searchValueDebounced = debouncedSignal(this.searchValue, 400, "");

  // activeFilter agora é computed: muda sozinho quando qualquer signal muda
  private readonly activeFilter = computed<BookFilter>(() => ({
    [this.searchField()]: this.searchValueDebounced() || undefined,
    genreName: this.genreFilter() || undefined,
  }));

  protected books = rxResource({
    params: () => this.activeFilter(),
    stream: ({ params }) => this.bookService.findAll(params),
  });

  constructor() {
    this.genreService.findAll({}).subscribe((genres) => this.genres.set(genres));

    effect(() => {
      if (this.books.error()) {
        const err = this.books.error() as HttpErrorResponse;
        this.toastr.error("Erro ao listar livros", { description: err?.message });
      }
    });
  }

  openAdd() {
    this.showAddModal.set(true);
  }

  openEdit(book: BookInfoResponse) {
    this.selectedBook.set(book);
    this.showEditModal.set(true);
  }

  openDelete(book: BookInfoResponse) {
    this.selectedBook.set(book);
    this.showDeleteModal.set(true);
  }

  saveNewBook(payload: BookCreateRequest) {
    this.bookService.save(payload).subscribe({
      next: () => {
        this.toastr.success("Livro cadastrado com sucesso!");
        this.showAddModal.set(false);
        this.books.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error("Erro ao cadastrar livro", { description: err.error?.message || err.message });
      },
    });
  }

  saveEditBook(payload: BookCreateRequest) {
    const book = this.selectedBook();
    if (!book) return;

    this.bookService.update(payload, book.id).subscribe({
      next: () => {
        this.toastr.success("Livro atualizado com sucesso!");
        this.showEditModal.set(false);
        this.books.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error("Erro ao atualizar livro", { description: err.error?.message || err.message });
      },
    });
  }

  confirmDeleteBook() {
    const book = this.selectedBook();
    if (!book) return;

    this.bookService.delete(book.id).subscribe({
      next: () => {
        this.toastr.success("Livro excluído com sucesso!");
        this.showDeleteModal.set(false);
        this.books.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error("Erro ao excluir livro", { description: err.error?.message || err.message });
      },
    });
  }

  clear() {
    this.searchValue.set("");
    this.genreFilter.set("");
  }

  readonly placeholder = computed<string>(() => {
    const labels: Record<SearchField, string> = {
      [SearchField.TITLE]: "Buscar por título...",
      [SearchField.AUTHOR]: "Buscar por autor...",
      [SearchField.ISBN]: "Buscar por ISBN...",
    };
    return labels[this.searchField()];
  });
}