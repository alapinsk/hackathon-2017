import { Injectable } from "@angular/core";
import { getString, setString } from "application-settings";


const tokenKey = "token";

export class BackendService {
  static apiUrl = "https://test-flights-19683.firebaseio.com";

  static isLoggedIn(): boolean {
    return !!getString("token");
  }

  static get token(): string {
    return getString("token");
  }

  static set token(theToken: string) {
    setString("token", theToken);
  }
}
