import { Pipe, PipeTransform } from "@angular/core";
import { LoanStatus } from "@/shared/enums/loan-status";

@Pipe({ name: "loanStatusLabel", standalone: true })
export class LoanStatusLabelPipe implements PipeTransform {
  transform(status: LoanStatus): string {
    const map: Record<LoanStatus, string> = {
      [LoanStatus.BORROWED]: "Ativo",
      [LoanStatus.RENEWED]: "Renovado",
      [LoanStatus.RETURNED]: "Devolvido",
      [LoanStatus.OVERDUE]: "Atrasado",
      [LoanStatus.LOST]: "Perdido",
      [LoanStatus.CANCELLED]: "Cancelado",
    };
    return map[status] ?? status;
  }
}

@Pipe({ name: "loanStatusBadge", standalone: true })
export class LoanStatusBadgePipe implements PipeTransform {
  transform(status: LoanStatus): string {
    const map: Record<LoanStatus, string> = {
      [LoanStatus.BORROWED]: "c-badge c-badge--info",
      [LoanStatus.RENEWED]: "c-badge c-badge--info",
      [LoanStatus.RETURNED]: "c-badge c-badge--success",
      [LoanStatus.OVERDUE]: "c-badge c-badge--danger",
      [LoanStatus.LOST]: "c-badge c-badge--muted",
      [LoanStatus.CANCELLED]: "c-badge c-badge--muted",
    };
    return map[status] ?? "c-badge c-badge--muted";
  }
}
