import { BookInfoResponse } from "@/shared/models/books.interface";
import { Component, input, output } from "@angular/core";
import { LoadingComponent } from "@/shared/components/loading/loading.component";

@Component({
  selector: "app-table-books",
  imports: [LoadingComponent],
  templateUrl: "./table-books.component.html",
  styleUrl: "./table-books.component.scss",
})
export class TableBooksComponent {
  data = input<BookInfoResponse[] | undefined>(undefined);
  isLoading = input<boolean>(false);

  edit = output<BookInfoResponse>();
  delete = output<BookInfoResponse>();
}
