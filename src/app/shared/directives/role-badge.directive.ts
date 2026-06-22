import { Directive, ElementRef, Renderer2, effect, inject, input } from "@angular/core";
import { UserRole } from "@/shared/enums/user-role";

@Directive({
  selector: "[appRoleBadge]",
})
export class RoleBadgeDirective {
  appRoleBadge = input.required<UserRole>();

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const role = this.appRoleBadge();
      const element = this.el.nativeElement;

      this.renderer.removeClass(element, "c-badge--warning");
      this.renderer.removeClass(element, "c-badge--info");
      this.renderer.addClass(element, "c-badge");

      if (role === UserRole.ADMIN) {
        this.renderer.addClass(element, "c-badge--warning");
        this.renderer.setProperty(element, "innerText", "Admin");
      } else {
        this.renderer.addClass(element, "c-badge--info");
        this.renderer.setProperty(element, "innerText", "Leitor");
      }
    });
  }
}
