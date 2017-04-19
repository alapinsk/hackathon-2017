import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { flightsRouting } from "./flights.routing";
import { FlightsComponent } from "./flights.component";
import { flightListComponent } from "./flight-list/flight-list.component";

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    flightsRouting
  ],
  declarations: [
    FlightsComponent,
    flightListComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class FlightsModule {}
