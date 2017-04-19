import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { action } from "ui/dialogs";
import { Color } from "color";
import { Page } from "ui/page";
import { TextField } from "ui/text-field";
import * as SocialShare from "nativescript-social-share";

import { flightListComponent } from "./flight-list/flight-list.component";
import { flightService } from "./shared";
import { FirebaseService, alert } from "../shared";

@Component({
  selector: "gr-flights",
  moduleId: module.id,
  templateUrl: "./flights.component.html",
  styleUrls: ["./flights-common.css", "./flights.component.css"],
  providers: [flightService]
})
export class FlightsComponent implements OnInit {
  flight: string = "";
  isAndroid;
  isShowingRecent = false;
  isLoading = false;

  @ViewChild("flightTextField") flightTextField: ElementRef;

  constructor(private router: Router,
    private store: flightService,
    private firebaseService: FirebaseService,
    private page: Page) {}

  ngOnInit() {
    this.isAndroid = !!this.page.android;
    this.page.actionBarHidden = true;
    this.page.className = "list-page";
  }

  // Prevent the first textfield from receiving focus on Android
  // See http://stackoverflow.com/questions/5056734/android-force-edittext-to-remove-focus
  handleAndroidFocus(textField, container) {
    if (container.android) {
      container.android.setFocusableInTouchMode(true);
      container.android.setFocusable(true);
      textField.android.clearFocus();
    }
  }

  showActivityIndicator() {
    this.isLoading = true;
  }
  hideActivityIndicator() {
    this.isLoading = false;
  }

  add(target: string) {
    // If showing recent flights the add button should do nothing.
    if (this.isShowingRecent) {
      return;
    }

    let textField = <TextField>this.flightTextField.nativeElement;

    if (this.flight.trim() === "") {
      // If the user clicked the add button, and the textfield is empty,
      // focus the text field and return.
      if (target === "button") {
        textField.focus();
      } else {
        // If the user clicked return with an empty text field show an error.
        alert("Enter a flight item");
      }
      return;
    }

    // Dismiss the keyboard
    // TODO: Is it better UX to dismiss the keyboard, or leave it up so the
    // user can continue to add more flights?
    textField.dismissSoftInput();

    this.showActivityIndicator();
    this.store.add(this.flight)
       .then(() => {
          this.flight = "";
          this.hideActivityIndicator();
       }
    );
  }
  

  toggleRecent() {
  
    this.isShowingRecent = !this.isShowingRecent;

    //this.showActivityIndicator();
    // this.store.restore()
    //   .subscribe(
    //     () => {
    //       this.isShowingRecent = false;
    //       this.hideActivityIndicator();
    //     },
    //     () => {
    //       alert("An error occurred while adding flights to your list.");
    //       this.hideActivityIndicator();
    //     }
    //   );
  }

  showMenu() {
    action({
      message: "What would you like to do?",
      actions: ["Share", "Log Off"],
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result === "Share") {
        this.share();
      } else if (result === "Log Off") {
        this.logoff();
      }
    });
  }

  share() {
    let items = this.store.items.value;
    let list = [];
    for (let i = 0, size = items.length; i < size ; i++) {
      list.push(items[i].name);
    }
    SocialShare.shareText(list.join(", ").trim());
  }

  logoff() {
    this.firebaseService.logoff();
    this.router.navigate(["/login"]);
  }
}
