import { LoadingService } from "@/shared/services/loading.service";
import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { GooeyToasterComponent } from "ngx-gooey-toast"
import { LoadingComponent } from "./shared/components/loading/loading.component";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, GooeyToasterComponent, LoadingComponent],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App {
  protected readonly title = signal("LibraryManager.Web");
  protected readonly loadingService = inject(LoadingService);
}
