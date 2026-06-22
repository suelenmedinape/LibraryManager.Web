import { Component, computed, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { UserService } from "@/shared/services/user.service";
import { UserInfoResponse, UserUpdateRequest } from "@/shared/models/user.interface";
import { UserRole } from "@/shared/enums/user-role";
import { GooeyToastService } from "ngx-gooey-toast";
import { HeaderComponent } from "@/features/admin/components/header/header.component";
import { LoadingComponent } from "@/shared/components/loading/loading.component";
import { ConfirmModalComponent } from "@/shared/components/confirm-modal/confirm-modal.component";
import { FormsModule } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { debouncedSignal } from "@/shared/utils/signal.utils";
import { RoleBadgeDirective } from "@/shared/directives/role-badge.directive";


@Component({
  selector: "app-users",
  imports: [HeaderComponent, LoadingComponent, ConfirmModalComponent, FormsModule, RoleBadgeDirective],
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.scss",
})
export class UsersComponent {
  private readonly userService = inject(UserService);
  private readonly toastr = inject(GooeyToastService);

  readonly UserRole = UserRole;

  // Filtros
  readonly searchValue = signal<string>("");
  readonly roleFilter = signal<string>("");

  private readonly searchDebounced = debouncedSignal(this.searchValue, 400, "");

  private readonly activeFilter = computed(() => ({
    name: this.searchDebounced() || undefined,
    role: (this.roleFilter() as UserRole) || undefined,
  }));

  readonly users = rxResource({
    params: () => this.activeFilter(),
    stream: ({ params }) => this.userService.findAll(params),
  });

  // Modal states
  readonly showAddModal = signal(false);
  readonly showEditModal = signal(false);
  readonly showDeleteModal = signal(false);
  readonly selectedUser = signal<UserInfoResponse | null>(null);

  // Form fields — novo usuário
  readonly newForm = signal({
    fullName: "",
    email: "",
    cpf: "",
    birthDate: "",
    role: UserRole.USER,
    password: "",
    passwordConfirm: "",
  });

  // Form fields — editar usuário
  readonly editForm = signal({
    fullName: "",
    email: "",
    birthDate: "",
    role: UserRole.USER,
  });

  openEdit(user: UserInfoResponse) {
    this.selectedUser.set(user);
    this.editForm.set({
      fullName: user.fullName,
      email: user.email,
      birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split("T")[0] : "",
      role: user.role,
    });
    this.showEditModal.set(true);
  }

  openDelete(user: UserInfoResponse) {
    this.selectedUser.set(user);
    this.showDeleteModal.set(true);
  }

  updateNewField<K extends keyof ReturnType<typeof this.newForm>>(key: K, value: any) {
    this.newForm.update((current) => ({
      ...current,
      [key]: value,
    }));
  }

  updateEditField<K extends keyof ReturnType<typeof this.editForm>>(key: K, value: any) {
    this.editForm.update((current) => ({
      ...current,
      [key]: value,
    }));
  }

  saveNew() {
    const form = this.newForm();
    if (form.password !== form.passwordConfirm) {
      this.toastr.error("As senhas não coincidem");
      return;
    }
    this.userService
      .save({
        fullName: form.fullName,
        email: form.email,
        cpf: form.cpf,
        birthDate: new Date(form.birthDate),
        role: form.role,
        password: form.password,
      })
      .subscribe({
        next: () => {
          this.toastr.success("Usuário cadastrado com sucesso!");
          this.showAddModal.set(false);
          this.resetNewForm();
          this.users.reload();
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error("Erro ao cadastrar usuário", { description: err.error?.message || err.message });
        },
      });
  }

  saveEdit() {
    const user = this.selectedUser();
    if (!user) return;
    const form = this.editForm();
    const dto: UserUpdateRequest = {
      fullName: form.fullName,
      email: form.email,
      birthDate: form.birthDate ? new Date(form.birthDate) : undefined,
      role: form.role,
    };
    this.userService.update(dto, user.id).subscribe({
      next: () => {
        this.toastr.success("Usuário atualizado com sucesso!");
        this.showEditModal.set(false);
        this.users.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error("Erro ao atualizar usuário", { description: err.error?.message || err.message });
      },
    });
  }

  confirmDelete() {
    const user = this.selectedUser();
    if (!user) return;
    this.userService.delete(user.id).subscribe({
      next: () => {
        this.toastr.success("Usuário removido com sucesso!");
        this.showDeleteModal.set(false);
        this.users.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error("Erro ao remover usuário", { description: err.error?.message || err.message });
      },
    });
  }


  private resetNewForm() {
    this.newForm.set({
      fullName: "",
      email: "",
      cpf: "",
      birthDate: "",
      role: UserRole.USER,
      password: "",
      passwordConfirm: "",
    });
  }
}
