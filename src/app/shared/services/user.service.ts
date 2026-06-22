import { environment } from '@/env/environment';
import { UserCreateRequest, UserCreateResponse, UserFilter, UserInfoResponse, UserUpdateRequest } from '@/shared/models/user.interface';
import { buildParams } from '@/shared/utils/httpParams';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl: string = `${environment.baseUrl}/users`;
  private readonly http: HttpClient = inject(HttpClient);

  findAll(filter: UserFilter): Observable<UserInfoResponse[]> {
    return this.http.get<UserInfoResponse[]>(this.baseUrl, { params: buildParams(filter) });
  }

  findById(userId: number): Observable<UserInfoResponse> {
    return this.http.get<UserInfoResponse>(this.getUserUrlById(userId));
  }

  save(dto: UserCreateRequest): Observable<UserCreateResponse> {
    return this.http.post<UserCreateResponse>(this.baseUrl, dto);
  }

  update(dto: UserUpdateRequest, userId: number): Observable<void> {
    return this.http.patch<void>(this.getUserUrlById(userId), dto);
  }

  delete(userId: number): Observable<void> {
    return this.http.delete<void>(this.getUserUrlById(userId));
  }

  private getUserUrlById(id: number): string {
    return `${this.baseUrl}/${id}`;
  }
}
