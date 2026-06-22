import { Component, computed, effect, inject } from "@angular/core";
import { MetricCardComponent } from "./components/metric-card/metric-card.component";
import { HeaderComponent } from "../../components/header/header.component";
import { LastLoansComponent } from "@/features/admin/pages/admin-home/components/last-loans/last-loans.component";
import { LoansService } from "@/shared/services/loans.service";
import { UserService } from "@/shared/services/user.service";
import { BookService } from "@/shared/services/book.service";
import { GooeyToastService } from "ngx-gooey-toast";
import { rxResource } from "@angular/core/rxjs-interop";
import { Dashboard } from "@/shared/models/dashboard.interface";
import { LoanStatus } from "@/shared/enums/loan-status";
import { LoadingComponent } from "@/shared/components/loading/loading.component";
import { LoanInfoResponse } from "@/shared/models/loan.interface";
import { LibraryRulesComponent } from "./components/library-rules/library-rules.component";

@Component({
  selector: "app-admin-home",
  imports: [
    MetricCardComponent,
    HeaderComponent,
    LastLoansComponent,
    LoadingComponent,
    LibraryRulesComponent
],
  templateUrl: "./admin-home.component.html",
  styleUrl: "./admin-home.component.scss",
})
export class AdminHomeComponent {
  private readonly loanService = inject(LoansService);
  private readonly userService = inject(UserService);
  private readonly bookService = inject(BookService);

  private readonly toastr = inject(GooeyToastService);

  protected readonly metrics = computed<Dashboard>(() => {
    const booksVal = this.books.value() ?? [];
    const usersVal = this.users.value() ?? [];
    const loansVal = this.loans.value() ?? [];

    return {
      totalBooks: booksVal.length,
      registeredUsers: usersVal.length,
      activeLoans: loansVal.length,
      pendingReturns: loansVal.filter((l) => l.status === LoanStatus.OVERDUE).length,
    };
  });

  protected readonly lastLoans = computed<LoanInfoResponse[] | null>(() => {
    const loansVal = this.loans.value();
    if (!loansVal) return null;
    return [...loansVal]
      .sort((a, b) => new Date(b.borrowedAt).getTime() - new Date(a.borrowedAt).getTime())
      .slice(0, 8);
  });

  protected books = rxResource({
    params: () => true,
    stream: () => this.bookService.findAll({}),
  });

  protected users = rxResource({
    params: () => true,
    stream: () => this.userService.findAll({}),
  });

  protected loans = rxResource({
    params: () => true,
    stream: () => this.loanService.findAll({}),
  });

  constructor() {
    effect(() => {
      if (this.books.error()) this.toastr.error("Erro ao carregar livros");
      if (this.users.error()) this.toastr.error("Erro ao carregar usuarios");
      if (this.loans.error()) this.toastr.error("Erro ao carregar emprestimos");
    });
  }
}
