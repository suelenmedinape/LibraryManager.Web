import { Component, effect, input, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BookInfoResponse, BookCreateRequest } from "@/shared/models/books.interface";
import { GenreBasicResponse } from "@/shared/models/genre.interface";

@Component({
  selector: "app-book-modal",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./book-modal.component.html",
  styleUrl: "./book-modal.component.scss",
})
export class BookModalComponent {
  title = input.required<string>();
  book = input<BookInfoResponse | null>(null);
  genres = input<GenreBasicResponse[]>([]);

  save = output<BookCreateRequest>();
  close = output<void>();

  // Form Fields
  readonly formTitle = signal<string>("");
  readonly formAuthor = signal<string>("");
  readonly formPublisher = signal<string>("");
  readonly formYear = signal<number>(new Date().getFullYear());
  readonly formEdition = signal<number>(1);
  readonly formIsbn = signal<string>("");
  readonly formGenreIds = signal<number[]>([]);

  constructor() {
    effect(() => {
      const b = this.book();
      if (b) {
        this.formTitle.set(b.title);
        this.formAuthor.set(b.author);
        this.formPublisher.set(b.publisher);
        this.formYear.set(b.year);
        this.formEdition.set(b.edition);
        this.formIsbn.set(b.isbn);
        this.formGenreIds.set(b.genres.map((g) => g.id));
      } else {
        this.formTitle.set("");
        this.formAuthor.set("");
        this.formPublisher.set("");
        this.formYear.set(new Date().getFullYear());
        this.formEdition.set(1);
        this.formIsbn.set("");
        this.formGenreIds.set([]);
      }
    });
  }

  isGenreSelected(genreId: number): boolean {
    return this.formGenreIds().includes(genreId);
  }

  toggleGenreSelection(genreId: number) {
    const current = this.formGenreIds();
    if (current.includes(genreId)) {
      this.formGenreIds.set(current.filter((id) => id !== genreId));
    } else {
      this.formGenreIds.set([...current, genreId]);
    }
  }

  onSubmit() {
    const payload: BookCreateRequest = {
      title: this.formTitle(),
      author: this.formAuthor(),
      publisher: this.formPublisher(),
      year: Number(this.formYear()),
      edition: Number(this.formEdition()),
      isbn: this.formIsbn(),
      genreIds: this.formGenreIds(),
    };
    this.save.emit(payload);
  }
}
