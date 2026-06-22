import { Component, input, output } from "@angular/core";
import { BookInfoResponse } from "@/shared/models/books.interface";

@Component({
  selector: "app-catalog-card",
  imports: [],
  templateUrl: "./catalog-card.component.html",
  styleUrl: "./catalog-card.component.scss",
})
export class CatalogCardComponent {
  book = input.required<BookInfoResponse>();
  viewDetail = output<BookInfoResponse>();
}
