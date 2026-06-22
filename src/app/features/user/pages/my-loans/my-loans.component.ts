import { Component, computed, inject } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { LoansService } from "@/shared/services/loans.service";
import { LoanStatus } from "@/shared/enums/loan-status";
import { HeaderComponent } from "@/features/user/components/header/header.component";
import { LoadingComponent } from "@/shared/components/loading/loading.component";
import { LoanStatusLabelPipe, LoanStatusBadgePipe } from "@/shared/pipes/loan-status.pipe";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-my-loans",
  imports: [HeaderComponent, LoadingComponent, LoanStatusLabelPipe, LoanStatusBadgePipe, DatePipe],
  templateUrl: "./my-loans.component.html",
  styleUrl: "./my-loans.component.scss",
})
export class MyLoansComponent {
  private readonly loansService = inject(LoansService);

  readonly history = rxResource({
    params: () => true,
    stream: () => this.loansService.findMyHistory(),
  });

  readonly activeLoans = computed(() =>
    (this.history.value() ?? []).filter(
      (l) => l.status === LoanStatus.BORROWED || l.status === LoanStatus.RENEWED || l.status === LoanStatus.OVERDUE,
    ),
  );

  readonly pastLoans = computed(() =>
    (this.history.value() ?? []).filter(
      (l) => l.status === LoanStatus.RETURNED || l.status === LoanStatus.LOST || l.status === LoanStatus.CANCELLED,
    ),
  );

  readonly overdueCount = computed(
    () => (this.history.value() ?? []).filter((l) => l.status === LoanStatus.OVERDUE).length,
  );

  readonly returnedCount = computed(
    () => (this.history.value() ?? []).filter((l) => l.status === LoanStatus.RETURNED).length,
  );
}
