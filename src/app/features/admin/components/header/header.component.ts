import { Component, input } from "@angular/core";

@Component({
  selector: "app-header",
  imports: [],
  template: `
    <header class="l-app__header">
      <h1 style="font-size: 1.5rem; font-weight: 700; margin: 0;">{{ title() }}</h1>
    </header>
  `,
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  title = input.required<string>();
}
