import { Component, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { GenreService } from "@/shared/services/genre.service";
import { GenreInfoResponse } from "@/shared/models/genre.interface";
import { GooeyToastService } from "ngx-gooey-toast";
import { HeaderComponent } from "@/features/admin/components/header/header.component";
import { LoadingComponent } from "@/shared/components/loading/loading.component";
import { ConfirmModalComponent } from "@/shared/components/confirm-modal/confirm-modal.component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-genres",
  imports: [HeaderComponent, LoadingComponent, ConfirmModalComponent, FormsModule],
  templateUrl: "./genres.component.html",
  styleUrl: "./genres.component.scss",
})
export class GenresComponent {
  private readonly genreService = inject(GenreService);
  private readonly toastr = inject(GooeyToastService);

  readonly genres = rxResource({
    params: () => true,
    stream: () => this.genreService.findAll({}),
  });

  // Modal states
  readonly showAddModal = signal(false);
  readonly showEditModal = signal(false);
  readonly showDeleteModal = signal(false);
  readonly selectedGenre = signal<GenreInfoResponse | null>(null);

  // Form fields
  readonly newGenreName = signal("");
  readonly editGenreName = signal("");

  openEdit(genre: GenreInfoResponse) {
    this.selectedGenre.set(genre);
    this.editGenreName.set(genre.name);
    this.showEditModal.set(true);
  }

  openDelete(genre: GenreInfoResponse) {
    this.selectedGenre.set(genre);
    this.showDeleteModal.set(true);
  }

  saveNew() {
    if (!this.newGenreName().trim()) return;
    this.genreService.save({ name: this.newGenreName().trim() }).subscribe({
      next: () => {
        this.toastr.success("Gênero cadastrado com sucesso!");
        this.showAddModal.set(false);
        this.newGenreName.set("");
        this.genres.reload();
      },
      error: () => this.toastr.error("Erro ao cadastrar gênero"),
    });
  }

  saveEdit() {
    const genre = this.selectedGenre();
    if (!genre || !this.editGenreName().trim()) return;
    this.genreService.update({ name: this.editGenreName().trim() }, genre.id).subscribe({
      next: () => {
        this.toastr.success("Gênero atualizado com sucesso!");
        this.showEditModal.set(false);
        this.genres.reload();
      },
      error: () => this.toastr.error("Erro ao atualizar gênero"),
    });
  }

  confirmDelete() {
    const genre = this.selectedGenre();
    if (!genre) return;
    this.genreService.delete(genre.id).subscribe({
      next: () => {
        this.toastr.success("Gênero removido com sucesso!");
        this.showDeleteModal.set(false);
        this.genres.reload();
      },
      error: () => this.toastr.error("Erro ao remover gênero"),
    });
  }
}
