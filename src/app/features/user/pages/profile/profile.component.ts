import { Component, computed, effect, inject, signal, input } from "@angular/core";
import { UserService } from "@/shared/services/user.service";
import { AuthService } from "@/core/auth/services/auth.service";
import { GooeyToastService } from "ngx-gooey-toast";
import { UserUpdateRequest, UserInfoResponse } from "@/shared/models/user.interface";
import { HeaderComponent } from "@/features/user/components/header/header.component";
import { RouterLink } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-profile",
  imports: [HeaderComponent, RouterLink],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfileComponent {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(GooeyToastService);

  readonly userId = this.authService.decodedToken()?.userId ?? 0;

  // Single typed signal for the form, matching UserUpdateRequest interface
  readonly form = signal<UserUpdateRequest & { cpf?: string; confirmPassword?: string }>({
    fullName: "",
    email: "",
    cpf: "",
    birthDate: undefined,
    password: "",
    confirmPassword: "",
  });

  readonly isSaving = signal<boolean>(false);

  // Data loaded via resolver
  readonly userProfile = input<UserInfoResponse | null>();

  readonly formBirthDateString = computed(() => {
    const date = this.form().birthDate;
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  });

  constructor() {
    // Reactively copy loaded user values to form when resource resolves
    effect(() => {
      const user = this.userProfile();
      if (user) {
        this.form.set({
          fullName: user.fullName,
          email: user.email,
          cpf: user.cpf,
          birthDate: user.birthDate ? new Date(user.birthDate) : undefined,
          password: "",
          confirmPassword: "",
        });
      }
    });
  }

  updateField<K extends keyof (UserUpdateRequest & { cpf?: string; confirmPassword?: string })>(
    key: K,
    value: (UserUpdateRequest & { cpf?: string; confirmPassword?: string })[K],
  ) {
    let finalValue: any = value;
    if (key === "birthDate" && typeof value === "string") {
      finalValue = new Date(value + "T00:00:00");
    }
    this.form.update((current) => ({
      ...current,
      [key]: finalValue,
    }));
  }

  save() {
    const formData = this.form();

    if (formData.password && formData.password !== formData.confirmPassword) {
      this.toastr.error("As senhas não coincidem");
      return;
    }

    this.isSaving.set(true);

    const dto: UserUpdateRequest = {
      fullName: formData.fullName,
      email: formData.email,
      birthDate: formData.birthDate,
    };

    if (formData.password) {
      dto.password = formData.password;
    }

    this.userService.update(dto, this.userId).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.toastr.success("Perfil atualizado com sucesso!");
        // Reset password fields
        this.form.update((current) => ({
          ...current,
          password: "",
          confirmPassword: "",
        }));
      },
      error: (err: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.toastr.error("Erro ao salvar alterações", { description: err.error?.message || err.message });
      },
    });
  }
}
