import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { GooeyToasterComponent } from "ngx-gooey-toast"

@Component({
  selector: "app-root",
  imports: [RouterOutlet, GooeyToasterComponent],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App {
  protected readonly title = signal("LibraryManager.Web");
}
