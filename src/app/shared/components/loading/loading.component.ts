import { Component, input } from "@angular/core";

@Component({
  selector: "app-loading",
  imports: [],
  host: {
    "[class.relative-host]": "relative()",
  },
  template: `
    <div class="loading-overlay" [class.loading-overlay--relative]="relative()">
      <div class="loading-overlay__container">
        <img src="https://www.imagensanimadas.com/data/media/53/livro-imagem-animada-0018.gif" class="loading-overlay__logo" alt="Carregando..." />
        <div class="loading-overlay__text">carregando...</div>
      </div>
    </div>
  `,
  styleUrl: "./loading.component.scss",
})
export class LoadingComponent {
  relative = input<boolean>(false);
}
