import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { FlightsComponent } from "./flights.component";
import { AuthGuard } from "../auth-guard.service";

const flightsRoutes: Routes = [
  { path: "flights", component: FlightsComponent, canActivate: [AuthGuard] },
];
export const flightsRouting: ModuleWithProviders = RouterModule.forChild(flightsRoutes);