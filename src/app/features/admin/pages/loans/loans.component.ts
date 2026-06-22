import { Component, computed, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { LoansService } from "@/shared/services/loans.service";
import { UserService } from "@/shared/services/user.service";
import { BookService } from "@/shared/services/book.service";
import { LoanInfoResponse, LoanCreateRequest } from "@/shared/models/loan.interface";
import { LoanStatus } from "@/shared/enums/loan-status";
import { GooeyToastService } from "ngx-gooey-toast";
import { HeaderComponent } from "@/features/admin/components/header/header.component";
import { LoadingComponent } from "@/shared/components/loading/loading.component";
import { ConfirmModalComponent } from "@/shared/components/confirm-modal/confirm-modal.component";
import { LoanStatusLabelPipe, LoanStatusBadgePipe } from "@/shared/pipes/loan-status.pipe";
import { FormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { debouncedSignal } from "@/shared/utils/signal.utils";

type LoanAction = "renew" | "return" | "lost" | "cancel";

@Component({
  selector: "app-loans",
  imports: [
    HeaderComponent,
    LoadingComponent,
    ConfirmModalComponent,
    LoanStatusLabelPipe,
    LoanStatusBadgePipe,
    FormsModule,
    DatePipe,
  ],
  templateUrl: "./loans.component.html",
  styleUrl: "./loans.component.scss",
})
export class LoansComponent {
  private readonly loansService = inject(LoansService);
  private readonly userService = inject(UserService);
  private readonly bookService = inject(BookService);
  private readonly toastr = inject(GooeyToastService);

  readonly LoanStatus = LoanStatus;

  // Filtros
  readonly statusFilter = signal<string>("");
  readonly searchValue = signal<string>("");

  private readonly searchDebounced = debouncedSignal(this.searchValue, 400, "");

  readonly loans = rxResource({
    params: () => ({ status: (this.statusFilter() as LoanStatus) || undefined }),
    stream: ({ params }) => this.loansService.findAll(params),
  });

  readonly filteredLoans = computed(() => {
    const list = this.loans.value() ?? [];
    const query = this.searchDebounced().toLowerCase().trim();
    if (!query) return list;
    return list.filter(
      (loan) =>
        loan.user.fullName.toLowerCase().includes(query) ||
        loan.book.title.toLowerCase().includes(query)
    );
  });

  // Listas auxiliares para o form de novo empréstimo
  readonly users = rxResource({ params: () => true, stream: () => this.userService.findAll({}) });
  readonly books = rxResource({ params: () => true, stream: () => this.bookService.findAll({}) });

  // Modais
  readonly showNewModal = signal(false);
  readonly showConfirmModal = signal(false);
  readonly selectedLoan = signal<LoanInfoResponse | null>(null);
  readonly pendingAction = signal<LoanAction | null>(null);

  // Form novo empréstimo
  readonly newUserId = signal<number | null>(null);
  readonly newBookId = signal<number | null>(null);
  readonly newDueDate = signal<string>(this.defaultDueDate());

  openAction(loan: LoanInfoResponse, action: LoanAction) {
    this.selectedLoan.set(loan);
    this.pendingAction.set(action);
    this.showConfirmModal.set(true);
  }

  executeAction() {
    const loan = this.selectedLoan();
    const action = this.pendingAction();
    if (!loan || !action) return;

    let request$;
    switch (action) {
      case "renew":   request$ = this.loansService.renew(loan.id); break;
      case "return":  request$ = this.loansService.finalize(loan.id, { returnedAt: new Date() }); break;
      case "lost":    request$ = this.loansService.lost(loan.id); break;
      case "cancel":  request$ = this.loansService.cancel(loan.id); break;
    }

    request$.subscribe({
      next: () => {
        this.toastr.success(this.actionSuccessMessage(action));
        this.showConfirmModal.set(false);
        this.loans.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error("Erro ao executar operação", { description: err.error?.message || err.message });
      },
    });
  }

  saveNewLoan() {
    if (!this.newUserId() || !this.newBookId()) {
      this.toastr.error("Selecione o leitor e o livro");
      return;
    }
    const dto: LoanCreateRequest = {
      userId: this.newUserId()!,
      bookId: this.newBookId()!,
      borrowedAt: new Date(),
    };
    this.loansService.save(dto).subscribe({
      next: () => {
        this.toastr.success("Empréstimo registrado com sucesso!");
        this.showNewModal.set(false);
        this.newUserId.set(null);
        this.newBookId.set(null);
        this.newDueDate.set(this.defaultDueDate());
        this.loans.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error("Erro ao registrar empréstimo", { description: err.error?.message || err.message });
      },
    });
  }

  canRenewOrReturn(loan: LoanInfoResponse): boolean {
    return loan.status === LoanStatus.BORROWED || loan.status === LoanStatus.OVERDUE || loan.status === LoanStatus.RENEWED;
  }

  confirmModalTitle(): string {
    const map: Record<LoanAction, string> = {
      renew: "Renovar Prazo",
      return: "Registrar Devolução",
      lost: "Sinalizar Perda de Livro",
      cancel: "Cancelar Transação",
    };
    return map[this.pendingAction() ?? "cancel"];
  }

  confirmModalMessage(): string {
    const loan = this.selectedLoan();
    if (!loan) return "";
    const map: Record<LoanAction, string> = {
      renew: `Deseja estender o prazo de devolução para "${loan.user.fullName}"?`,
      return: `Confirmar devolução do livro "${loan.book.title}" por ${loan.user.fullName}?`,
      lost: `Sinalizar o livro "${loan.book.title}" como perdido/sinistrado?`,
      cancel: `Cancelar o registro do empréstimo de "${loan.book.title}" para ${loan.user.fullName}?`,
    };
    return map[this.pendingAction() ?? "cancel"];
  }

  confirmModalVariant() {
    const action = this.pendingAction();
    if (action === "return") return "success" as const;
    if (action === "renew") return "warning" as const;
    return "danger" as const;
  }

  private actionSuccessMessage(action: LoanAction): string {
    const map: Record<LoanAction, string> = {
      renew: "Prazo renovado com sucesso!",
      return: "Devolução registrada com sucesso!",
      lost: "Livro sinalizado como perdido.",
      cancel: "Empréstimo cancelado.",
    };
    return map[action];
  }

  private defaultDueDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  }
}
