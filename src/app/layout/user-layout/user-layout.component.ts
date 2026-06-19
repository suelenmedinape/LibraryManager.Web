import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-user-layout",
  imports: [RouterOutlet],
  template: `
    <div class="l-app">
      <!-- SIDEBAR -->
      <aside class="l-app__sidebar">
        <a href="index.html" class="c-logo">
          <div class="c-logo__icon">
            <!-- Flowbite book-open SVG -->
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6.035a1 1 0 011.109-.894l8.9 1.054a1 1 0 01.891.996v11.758a1 1 0 01-.891.996l-8.9 1.054a1 1 0 01-1.109-.894V6.035zM12 6.035a1 1 0 00-1.109-.894l-8.9 1.054A1 1 0 001 7.191v11.758a1 1 0 00.891.996l8.9 1.054a1 1 0 001.109-.894V6.035z"
              ></path>
            </svg>
          </div>
          <div class="c-logo__text">Biblio<span>Tech</span></div>
        </a>

        <nav class="c-nav">
          <ul class="c-nav__list">
            <li class="c-nav__item">
              <a href="index.html" class="c-nav__link">
                <span class="c-nav__icon">
                  <!-- Flowbite book SVG -->
                  <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    ></path>
                  </svg>
                </span>
                <span class="c-nav__label">Catálogo</span>
              </a>
            </li>
            <li class="c-nav__item">
              <a href="loans.html" class="c-nav__link c-nav__link--active">
                <span class="c-nav__icon">
                  <!-- Flowbite history SVG -->
                  <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </span>
                <span class="c-nav__label">Meus Empréstimos</span>
              </a>
            </li>
            <li class="c-nav__item">
              <a href="profile.html" class="c-nav__link">
                <span class="c-nav__icon">
                  <!-- Flowbite user SVG -->
                  <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </span>
                <span class="c-nav__label">Meu Perfil</span>
              </a>
            </li>
          </ul>

          <div class="c-nav__footer">
            <div class="u-font-bold">Leitor Ativo</div>
            <div class="u-text-muted" style="font-size: 0.8rem;">suelen@bibliotech.com</div>
          </div>
        </nav>
      </aside>

      <router-outlet />
    </div>
  `,
  styleUrl: "../styles/layout.scss",
})
export class UserLayoutComponent {}
