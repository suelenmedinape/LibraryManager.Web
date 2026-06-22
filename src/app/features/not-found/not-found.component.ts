import { AuthService } from '@/core/auth/services/auth.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  private readonly authService = inject(AuthService);

  redirectTo() {
    this.authService.redirectUser();
  }
}
