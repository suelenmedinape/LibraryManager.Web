import { Auth } from "@/core/auth/models/auth.interface";
import { AuthService } from "@/core/auth/services/auth.service";
import { DefaultError } from "@/shared/models/errors.interface";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, signal } from "@angular/core";
import { form, required, submit, FormField } from "@angular/forms/signals";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { GooeyToastService } from "ngx-gooey-toast";

@Component({
  selector: "app-login",
  imports: [FormField],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(GooeyToastService);
  private readonly router = inject(Router);

  readonly loginModel = signal<Auth>({
    email: "",
    password: "",
  });
  readonly loginForm = form(this.loginModel, (schema) => {
    required(schema.email, { message: "Email is required " });
    required(schema.password, { message: "Senha is required" });
  });

  save(event: Event) {
    event.preventDefault();
    submit(this.loginForm, {
      action: async (field) => {
        this.authService.login(field().value()).subscribe({
          next: () => {
            const id = this.toastr.info("Successfully logged in.");
            this.toastr.update(id, { title: "Successfully logged in.", type: "success" });
            this.router.navigate([this.authService.redirectUser()]);
          },
          error: (error: HttpErrorResponse) => {
            const erro = error.error as DefaultError;
            const id = this.toastr.info(erro.message);
            this.toastr.update(id, { title: erro.message, type: "error" });
          },
        });
      },
      onInvalid: (field) => {
        field().errorSummary()?.[0].fieldTree().focusBoundControl();
      },
      ignoreValidators: "none",
    });
  }
}
