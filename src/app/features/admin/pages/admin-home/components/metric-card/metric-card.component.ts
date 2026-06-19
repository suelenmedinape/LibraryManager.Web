import { Dashboard } from "@/features/admin/interfaces/dashboard.interface";
import { Component, input } from "@angular/core";

@Component({
  selector: "app-metric-card",
  imports: [],
  templateUrl: "./metric-card.component.html",
  styleUrl: "./metric-card.component.scss",
})
export class MetricCardComponent {
  data = input<Dashboard | null>(null);
}
