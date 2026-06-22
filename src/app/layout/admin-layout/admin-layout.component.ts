import { Component, computed, inject } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "@/core/auth/services/auth.service";

@Component({
  selector: "app-admin-layout",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="l-app">
      <!-- SIDEBAR -->
      <aside class="l-app__sidebar">
        <a routerLink="/admin/dashboard" class="c-logo">
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
              <a
                routerLink="/admin/home"
                routerLinkActive="c-nav__link--active"
                class="c-nav__link"
              >
                <span class="c-nav__icon">
                  <!-- Flowbite chart-pie SVG -->
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
                      d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                    ></path>
                  </svg>
                </span>
                <span class="c-nav__label">Dashboard</span>
              </a>
            </li>
            <li class="c-nav__item">
              <a
                routerLink="/admin/books"
                routerLinkActive="c-nav__link--active"
                class="c-nav__link"
              >
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
                <span class="c-nav__label">Livros</span>
              </a>
            </li>
            <li class="c-nav__item">
              <a
                routerLink="/admin/genres"
                routerLinkActive="c-nav__link--active"
                class="c-nav__link"
              >
                <span class="c-nav__icon">
                  <!-- Flowbite tag SVG -->
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
                      d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </span>
                <span class="c-nav__label">Gêneros</span>
              </a>
            </li>
            <li class="c-nav__item">
              <a
                routerLink="/admin/users"
                routerLinkActive="c-nav__link--active"
                class="c-nav__link"
              >
                <span class="c-nav__icon">
                  <!-- Flowbite users SVG -->
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                </span>
                <span class="c-nav__label">Leitores</span>
              </a>
            </li>
            <li class="c-nav__item">
              <a
                routerLink="/admin/loans"
                routerLinkActive="c-nav__link--active"
                class="c-nav__link"
              >
                <span class="c-nav__icon">
                  <!-- Flowbite exchange SVG -->
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
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    ></path>
                  </svg>
                </span>
                <span class="c-nav__label">Empréstimos</span>
              </a>
            </li>
          </ul>

          <div class="c-nav__footer">
            <div class="u-font-bold">{{ userName() }}</div>
            <div class="u-text-muted" style="font-size: 0.8rem;">{{ userEmail() }}</div>
          </div>
        </nav>
      </aside>

      <router-outlet />
    </div>
  `,
  styleUrl: "../styles/layout.scss",
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);

  readonly userEmail = computed(() => this.authService.decodedToken()?.sub ?? "admin@bibliotech.com");
  readonly userName = computed(() => {
    const email = this.userEmail();
    const prefix = email.split("@")[0];
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  });
}
