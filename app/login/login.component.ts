import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Color } from "color";
import { connectionType, getConnectionType } from "connectivity";
import { Animation } from "ui/animation";
import { View } from "ui/core/view";
import { prompt } from "ui/dialogs";
import { Page } from "ui/page";
import { TextField } from "ui/text-field";

import { alert, FirebaseService, User } from "../shared";



@Component({
  selector: "gr-login",
  moduleId: module.id,
  templateUrl: "./login.component.html",
  styleUrls: ["./login-common.css", "./login.component.css"],
})
export class LoginComponent implements OnInit {
  user: User;
  isLoggingIn = true;
  isAuthenticating = false;


  @ViewChild("initialContainer") initialContainer: ElementRef;
  @ViewChild("mainContainer") mainContainer: ElementRef;
  @ViewChild("logoContainer") logoContainer: ElementRef;
  @ViewChild("formControls") formControls: ElementRef;
  @ViewChild("signUpStack") signUpStack: ElementRef;
  @ViewChild("password") password: ElementRef;

  constructor(private router: Router,
    private userService: FirebaseService,
    private page: Page) {
    this.user = new User();
  }

  ngOnInit() {
    this.page.actionBarHidden = true;
  }

  

  focusPassword() {
    this.password.nativeElement.focus();
  }

  submit() {
    if (!this.user.isValidEmail()) {
      alert("Enter a valid email address.");
      return;
    }

    this.isAuthenticating = true;
    if (this.isLoggingIn) {
      this.email();
    } else {
      this.signUp();
    }
  }
  
  checkConnection(){
    if (getConnectionType() === connectionType.none) {
      alert("Flights requires an internet connection to log in.");
      return;
    }
  }
  email(){
    this.checkConnection();
    this.login(this.userService.loginWithEmail(this.user));
  }
  google(){
    this.checkConnection();
    this.login(this.userService.loginWithGoogle());
  }
  facebook(){
    this.checkConnection();
    this.login(this.userService.loginWithFacebook());
  }

  login(loginPromise: Promise<any>) {
    loginPromise
      .then(
        (result) => {
          console.log(result + " result");
          this.isAuthenticating = false;
          this.router.navigate(["/"]);
        },
        (error) => {
          alert("Unfortunately we could not find your account.");
          this.isAuthenticating = false;
        }
      );   
  }

  signUp() {
    if (getConnectionType() === connectionType.none) {
      alert("Flights requires an internet connection to register.");
      return;
    }

    this.userService.registerWithEmail(this.user)
      .then(
          (result) => {
            alert("Your account was successfully created." + result);
            this.isAuthenticating = false;
            this.toggleDisplay();
          },
          (message) => {
            alert("Unfortunately we were unable to create your account." + message);
            this.isAuthenticating = false;
          }
      );
  }


  forgotPassword() {
    prompt({
      title: "Forgot Password",
      message: "Enter the email address you used to register for Flights to reset your password.",
      defaultText: "",
      okButtonText: "Ok",
      cancelButtonText: "Cancel"
    }).then((data) => {
      if (data.result) {
        this.userService.resetPassword(data.text.trim())
          .then(
              function () {
                alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
              },
              function (errorMessage) {
                alert("Unfortunately, an error occurred resetting your password.");
              }
          );
      }
    });
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
    let mainContainer = <View>this.mainContainer.nativeElement;
    mainContainer.animate({
      backgroundColor: this.isLoggingIn ? new Color("white") : new Color("#301217"),
      duration: 200
    });
  }

  startBackgroundAnimation(background) {
    background.animate({
      scale: { x: 1.0, y: 1.0 },
      duration: 10000
    });
  }

  showMainContent() {
    let initialContainer = <View>this.initialContainer.nativeElement;
    let mainContainer = <View>this.mainContainer.nativeElement;
    let logoContainer = <View>this.logoContainer.nativeElement;
    let formControls = <View>this.formControls.nativeElement;
    let signUpStack = <View>this.signUpStack.nativeElement;
    let animations = [];

    // Fade out the initial content over one half second
    initialContainer.animate({
      opacity: 0,
      duration: 500
    }).then(function() {
      // After the animation completes, hide the initial container and
      // show the main container and logo. The main container and logo will
      // not immediately appear because their opacity is set to 0 in CSS.
      initialContainer.style.visibility = "collapse";
      mainContainer.style.visibility = "visible";
      logoContainer.style.visibility = "visible";

      // Fade in the main container and logo over one half second.
      animations.push({ target: mainContainer, opacity: 1, duration: 500 });
      animations.push({ target: logoContainer, opacity: 1, duration: 500 });

      // Slide up the form controls and sign up container.
      animations.push({ target: signUpStack, translate: { x: 0, y: 0 }, opacity: 1, delay: 500, duration: 150 });
      animations.push({ target: formControls, translate: { x: 0, y: 0 }, opacity: 1, delay: 650, duration: 150 });

      // Kick off the animation queue
      new Animation(animations, false).play();
    });
  }
}
