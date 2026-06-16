import { environment } from "@/env/environment";
import {
  BookFilter,
  BookInfoResponse,
  BookCreateRequest,
  BookCreateResponse,
  BookUpdateRequest,
} from "@/features/books/models/books.interface";
import { buildParams } from "@/shared/utils/httpParams";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BookService {
  private readonly baseUrl: string = `${environment.baseUrl}/books`;
  private readonly http: HttpClient = inject(HttpClient);

  findAll(filter: BookFilter): Observable<BookInfoResponse[]> {
    return this.http.get<BookInfoResponse[]>(this.baseUrl, { params: buildParams(filter) });
  }

  findById(bookId: number): Observable<BookInfoResponse> {
    return this.http.get<BookInfoResponse>(this.getBookUrlById(bookId));
  }

  save(dto: BookCreateRequest): Observable<BookCreateResponse> {
    return this.http.post<BookCreateResponse>(this.baseUrl, dto);
  }

  update(dto: BookUpdateRequest, bookId: number): Observable<void> {
    return this.http.patch<void>(this.getBookUrlById(bookId), dto);
  }

  delete(bookId: number): Observable<void> {
    return this.http.delete<void>(this.getBookUrlById(bookId));
  }

  private getBookUrlById(id: number): string {
    return `${this.baseUrl}/${id}`;
  }
}
