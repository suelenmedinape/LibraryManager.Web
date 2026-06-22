import { Component, computed, input, output } from "@angular/core";

export type ModalVariant = "danger" | "warning" | "success";

@Component({
  selector: "app-confirm-modal",
  imports: [],
  templateUrl: "./confirm-modal.component.html",
  styleUrl: "./confirm-modal.component.scss",
})
export class ConfirmModalComponent {
  title = input.required<string>();
  message = input.required<string>();
  detail = input<string>("");
  confirmLabel = input<string>("Confirmar");
  cancelLabel = input<string>("Cancelar");
  variant = input<ModalVariant>("danger");

  confirmed = output<void>();
  cancelled = output<void>();

  iconPath = computed(() => {
    const v = this.variant();
    if (v === "success") return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
    if (v === "warning")
      return "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z";
    return "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z";
  });

  iconColor = computed(() => {
    const v = this.variant();
    if (v === "success") return "#10b981";
    if (v === "warning") return "#f59e0b";
    return "#b91c1c";
  });

  titleColor = computed(() => {
    const v = this.variant();
    if (v === "success") return "#059669";
    if (v === "warning") return "#d97706";
    return "#b91c1c";
  });

  confirmBtnClass = computed(() => {
    const v = this.variant();
    if (v === "success") return "c-btn c-btn--primary";
    return "c-btn c-btn--danger";
  });
}
