import { environment } from '@/env/environment';
import { LoanFilter, LoanInfoResponse, LoanHistoryResponse, LoanCreateRequest, LoanCreateResponse, LoanReturnRequest } from '@/shared/models/loan.interface';
import { buildParams } from '@/shared/utils/httpParams';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoansService {
  private readonly baseUrl: string = `${environment.baseUrl}/loans`;
  private readonly http: HttpClient = inject(HttpClient);

  findAll(filter: LoanFilter): Observable<LoanInfoResponse[]> {
    return this.http.get<LoanInfoResponse[]>(this.baseUrl, { params: buildParams(filter) });
  }

  findById(loanId: number): Observable<LoanInfoResponse> {
    return this.http.get<LoanInfoResponse>(this.getLoanUrlById(loanId));
  }

  findMyHistory(): Observable<LoanHistoryResponse[]> {
    return this.http.get<LoanHistoryResponse[]>(`${this.baseUrl}/my-history`)
  } 

  save(dto: LoanCreateRequest): Observable<LoanCreateResponse> {
    return this.http.post<LoanCreateResponse>(this.baseUrl, dto);
  }

  renew(loanId: number): Observable<void> {
    return this.http.patch<void>(`${this.getLoanUrlById(loanId)}/renew`, {});
  }

  finalize(loanId: number, dto: LoanReturnRequest): Observable<void> {
    return this.http.patch<void>(`${this.getLoanUrlById(loanId)}/return`, dto);
  }

  lost(loanId: number): Observable<void> {
    return this.http.patch<void>(`${this.getLoanUrlById(loanId)}/lost`, {});
  }

  cancel(loanId: number): Observable<void> {
    return this.http.patch<void>(`${this.getLoanUrlById(loanId)}/cancel`, {});
  }

  private getLoanUrlById(id: number): string {
    return `${this.baseUrl}/${id}`;
  }
}
