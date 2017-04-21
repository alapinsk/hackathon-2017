import { Injectable } from "@angular/core";
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { Password } from "../password";
import { Config } from "./config";
import { Airport } from "./models/airport.model";

@Injectable()
export class BackendService {
  
  airportList: Airport[];
  
  constructor(private options: RequestOptions, private http: Http) {}


  getNearbyAirports(geolocation) {
    let params: URLSearchParams = new URLSearchParams;
    params.set('apikey', Password.apikey);
    params.set('latitude', geolocation.latitude)
    params.set('longitude', geolocation.longitude)

    this.options.search = params;
    return this.http.get(
      Config.apiUrl + "geolocation/3/nearbyAirports",
      this.options
    )
    .map(response => response.json())
    .map(this.parseGeoloc)
    .catch(this.handleErrors);
  }

  parseGeoloc(response) {
    this.airportList = response.map(airport => {
      return new Airport(airport.iataCode, airport.name)         
    });
    return this.airportList;
  }

  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    console.log(error.url);
    return Observable.throw(error);
  }
}