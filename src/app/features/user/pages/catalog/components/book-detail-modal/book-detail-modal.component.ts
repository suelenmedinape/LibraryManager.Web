import { Component, input, output } from "@angular/core";
import { BookInfoResponse } from "@/shared/models/books.interface";

@Component({
  selector: "app-book-detail-modal",
  imports: [],
  templateUrl: "./book-detail-modal.component.html",
  styleUrl: "./book-detail-modal.component.scss",
})
export class BookDetailModalComponent {
  book = input.required<BookInfoResponse>();
  closed = output<void>();
}
