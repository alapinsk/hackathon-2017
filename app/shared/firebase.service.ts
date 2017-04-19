import { Injectable, NgZone } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";

import { User } from "./user.model";
import { BackendService } from "./backend.service";
import * as firebase from "nativescript-plugin-firebase";
import * as dialogs from "ui/dialogs";



@Injectable()
export class FirebaseService {
  constructor(private ngZone: NgZone) { 
    firebase.init({
        storageBucket: 'gs://ryanair-hackathon2017.appspot.com',
        persist: true,
        onAuthStateChanged: function(data) { // optional but useful to immediately re-logon the user when he re-visits your app
          console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");
          if (data.loggedIn) {
            BackendService.token = data.user.uid;
            //console.log("user's email address: " + (data.user.email ? data.user.email : "N/A"));
          }else { 
            BackendService.token = "";
          }
        }
      });
  }


  registerWithEmail(user: User) {
    return firebase.createUser({
      email: user.email,
      password: user.password
    });
  }

  loginWithEmail(user: User) {
    return firebase.login({
      type: firebase.LoginType.PASSWORD,
      email: user.email,
      password: user.password
    });
  }

  logoff() {
    firebase.logout();
  }

  resetPassword(email) {
    return firebase.resetPassword({
       email: email
    });
  }

  changePassword(email, oldPassword, newPassword) {
    firebase.changePassword({
      email: email,
      oldPassword: oldPassword,
      newPassword: newPassword
    }).then(
        function () {
          // called when password change was successful
        },
        function (errorMessage) {
          console.log(errorMessage);
        }
    );
  }

  loginWithFacebook(){
    return firebase.login({
      type: firebase.LoginType.FACEBOOK,
      scope: ['public_profile', 'email'] 
    });
  }
  
  loginWithGoogle(){
    return firebase.login({
      type: firebase.LoginType.GOOGLE
    });
  }



  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}
