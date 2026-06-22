import { LoanInfoResponse } from "@/shared/models/loan.interface";
import { DatePipe } from "@angular/common";
import { Component, input } from "@angular/core";
import { LoanStatusBadgePipe, LoanStatusLabelPipe } from "@/shared/pipes/loan-status.pipe";

@Component({
  selector: "app-last-loans",
  imports: [DatePipe, LoanStatusBadgePipe, LoanStatusLabelPipe],
  templateUrl: "./last-loans.component.html",
  styleUrl: "./last-loans.component.scss",
})
export class LastLoansComponent {
  data = input<LoanInfoResponse[] | null>(null);
}
