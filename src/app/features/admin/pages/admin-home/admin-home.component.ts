import { Component, effect, inject, signal } from "@angular/core";
import { MetricCardComponent } from "./components/metric-card/metric-card.component";
import { HeaderComponent } from "../../components/header/header.component";
import { LastLoansComponent } from "@/features/admin/pages/admin-home/components/last-loans/last-loans.component";
import { GenresStatisticsComponent } from "./components/genres-statistics/genres-statistics.component";
import { LoansService } from "@/shared/services/loans.service";
import { UserService } from "@/shared/services/user.service";
import { BookService } from "@/shared/services/book.service";
import { GenreService } from "@/shared/services/genre.service";
import { GooeyToastService } from "ngx-gooey-toast";
import { rxResource } from "@angular/core/rxjs-interop";
import { Dashboard } from "@/features/admin/interfaces/dashboard.interface";
import { LoanStatus } from "@/shared/enums/loan-status";
import { LoadingComponent } from "@/shared/components/loading/loading.component";
import { LoanInfoResponse } from "@/shared/models/loan.interface";

@Component({
  selector: "app-admin-home",
  imports: [
    MetricCardComponent,
    HeaderComponent,
    LastLoansComponent,
    GenresStatisticsComponent,
    LoadingComponent,
  ],
  templateUrl: "./admin-home.component.html",
  styleUrl: "./admin-home.component.scss",
})
export class AdminHomeComponent {
  private readonly loanService = inject(LoansService);
  private readonly userService = inject(UserService);
  private readonly bookService = inject(BookService);
  private readonly genreService = inject(GenreService);

  private readonly toastr = inject(GooeyToastService);

  protected metrics = signal<Dashboard | null>(null);
  protected lastLoans = signal<LoanInfoResponse[] | null>(null);

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

      this.metrics.set({
        totalBooks: this.books.value()?.length ?? 0,
        registeredUsers: this.users.value()?.length ?? 0,
        activeLoans: this.loans.value()?.length ?? 0,
        pendingReturns:
          this.loans.value()?.filter((l) => l.status === LoanStatus.OVERDUE).length ?? 0,
      });

      this.lastLoans.set(
        this.loans
          .value()
          ?.sort((a, b) => new Date(b.borrowedAt).getTime() - new Date(a.borrowedAt).getTime()).slice(0, 8) ??
          null,
      );
    });
  }
}
