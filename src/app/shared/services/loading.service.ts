import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly activeRequest = signal(0);

  readonly isLoading = computed(() => this.activeRequest() > 0);

  show() {
    this.activeRequest.update((count) => count + 1);
  }

  hide() {
    this.activeRequest.update((count) => Math.max(0, count - 1));
  }
}
