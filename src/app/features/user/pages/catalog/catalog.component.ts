import { Component, computed, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { BookService } from "@/shared/services/book.service";
import { GenreService } from "@/shared/services/genre.service";
import { BookInfoResponse } from "@/shared/models/books.interface";
import { LoadingComponent } from "@/shared/components/loading/loading.component";
import { CatalogCardComponent } from "./components/catalog-card/catalog-card.component";
import { BookDetailModalComponent } from "./components/book-detail-modal/book-detail-modal.component";
import { HeaderComponent } from "../../components/header/header.component";
import { debouncedSignal } from "@/shared/utils/signal.utils";
@Component({
  selector: "app-catalog",
  imports: [HeaderComponent, CatalogCardComponent, BookDetailModalComponent, LoadingComponent],
  templateUrl: "./catalog.component.html",
  styleUrl: "./catalog.component.scss",
})
export class CatalogComponent {
  private readonly bookService = inject(BookService);
  private readonly genreService = inject(GenreService);

  readonly searchValue = signal<string>("");
  readonly genreFilter = signal<string>("");
  readonly selectedBook = signal<BookInfoResponse | null>(null);

  private readonly searchDebounced = debouncedSignal(this.searchValue, 400, "");

  private readonly activeFilter = computed(() => ({
    title: this.searchDebounced() || undefined,
    genreName: this.genreFilter() || undefined,
  }));

  readonly books = rxResource({
    params: () => this.activeFilter(),
    stream: ({ params }) => this.bookService.findAll(params),
  });

  readonly genres = rxResource({
    params: () => true,
    stream: () => this.genreService.findAll({}),
  });

  openDetail(book: BookInfoResponse) {
    this.selectedBook.set(book);
  }

  closeDetail() {
    this.selectedBook.set(null);
  }

  clear() {
    this.searchValue.set("");
    this.genreFilter.set("");
  }
}
