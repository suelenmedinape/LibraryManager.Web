import { environment } from "@/env/environment";
import { GenreFilter, GenreInfoResponse, GenreCreateRequest, GenreUpdateRequest } from "@/shared/models/genre.interface";
import { buildParams } from "@/shared/utils/httpParams";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GenreService {
  private readonly baseUrl: string = `${environment.baseUrl}/genres`;
  private readonly http: HttpClient = inject(HttpClient);

  findAll(filter: GenreFilter): Observable<GenreInfoResponse[]> {
    return this.http.get<GenreInfoResponse[]>(this.baseUrl, { params: buildParams(filter) });
  }

  findById(genreId: number): Observable<GenreInfoResponse> {
    return this.http.get<GenreInfoResponse>(this.getGenreUrlById(genreId));
  }

  save(dto: GenreCreateRequest): Observable<GenreInfoResponse> {
    return this.http.post<GenreInfoResponse>(this.baseUrl, dto);
  }

  update(dto: GenreUpdateRequest, genreId: number): Observable<void> {
    return this.http.patch<void>(this.getGenreUrlById(genreId), dto);
  }

  delete(genreId: number): Observable<void> {
    return this.http.delete<void>(this.getGenreUrlById(genreId));
  }

  private getGenreUrlById(id: number): string {
    return `${this.baseUrl}/${id}`;
  }
}
