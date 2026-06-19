import { LoanStatus } from "@/shared/enums/loan-status";
import { LoanInfoResponse } from "@/shared/models/loan.interface";
import { DatePipe } from "@angular/common";
import { Component, input } from "@angular/core";

@Component({
  selector: "app-last-loans",
  imports: [DatePipe],
  templateUrl: "./last-loans.component.html",
  styleUrl: "./last-loans.component.scss",
})
export class LastLoansComponent {
  data = input<LoanInfoResponse[] | null>(null);

  badgeClass(status: LoanStatus): string {
  const map: Record<LoanStatus, string> = {
    [LoanStatus.BORROWED]: "c-badge--info",
    [LoanStatus.RENEWED]: "c-badge--info",
    [LoanStatus.RETURNED]: "c-badge--success",
    [LoanStatus.OVERDUE]: "c-badge--danger",
    [LoanStatus.LOST]: "c-badge--danger",
    [LoanStatus.CANCELLED]: "c-badge--muted",
  };
  return map[status] ?? "c-badge--muted";
}

statusLabel(status: LoanStatus): string {
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
