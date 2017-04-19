import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from "@angular/core";
import * as utils from "utils/utils";

import { Flight, flightService } from "../shared";
import { alert } from "../../shared";
import { Observable, BehaviorSubject } from "rxjs/Rx";

declare var UIColor: any;

@Component({
  selector: "gr-flight-list",
  moduleId: module.id,
  templateUrl: "./flight-list.component.html",
  styleUrls: ["./flight-list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class flightListComponent {
  @Input() row;
  
  listLoaded = false;

  constructor(private store: flightService) { }
  

  load() {
    this.store.load()
        .subscribe(
          () => {
            this.listLoaded = true;
          },
          () => {
            alert("An error occurred loading your flight list.");
          }
        );
  }

  // The following trick makes the background color of each cell
  // in the UITableView transparent as it’s created.
  makeBackgroundTransparent(args) {
    let cell = args.ios;
    if (cell) {
      // support XCode 8
      cell.backgroundColor = utils.ios.getter(UIColor, UIColor.clearColor);
    }
  }

  imageSource(flight) {
    if (flight.deleted) {
      return flight.done ? "res://selected" : "res://nonselected";
    }
    return flight.done ? "res://checked" : "res://unchecked";
  }

  toggleDone(flight: Flight) {
    if (flight.deleted) {
      flight.done = !flight.done;
      return;
    }

    this.store.toggleDoneFlag(flight);
  }

  delete(flight: Flight) {
      console.log("items value: " + this.store.items.getValue().toString())
      this.store.permanentlyDelete(flight);
  }
}

