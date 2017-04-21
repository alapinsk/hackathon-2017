import { Injectable , NgZone} from "@angular/core";
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";

import { Observable, BehaviorSubject } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { Password } from "../password";
import { Config } from "./config";
import { Airport } from "./models/airport.model";
import { Flight } from "./models/flight.model";

import geolocation = require("nativescript-geolocation");
import * as enums_1 from "ui/enums";

@Injectable()
export class BackendService {
  
  airports: BehaviorSubject<Array<Airport>> = new BehaviorSubject([]);
  flights: BehaviorSubject<Array<Flight>> = new BehaviorSubject([]);
  public airportList: Airport[];
  public flightList: Flight[];
  
  constructor(private options: RequestOptions, private http: Http, private zone: NgZone) {}

//   getGeoLocation () {
//         if (!geolocation.isEnabled()) {
//             geolocation.enableLocationRequest();
//         }         
//         return geolocation.getCurrentLocation({ desiredAccuracy: enums_1.Accuracy.high, updateDistance: 0.1, maximumAge: 5000, timeout: 20000 })    
//   }

//   getNearbyAirports(limit = "1") {
//     return new Observable<any> ((observer: any) => {
//       this.getGeoLocation().then((result) => {
//         let params: URLSearchParams = new URLSearchParams;
//         params.set('apikey', Password.apikey);
//         params.set('latitude', result.latitude + "")
//         params.set('longitude',  result.longitude + "")
//         params.set('limit', limit)
//         this.options.search = params;
//         return this.http.get(
//           Config.apiUrl + "geolocation/3/nearbyAirports",
//           this.options
//         )
//         .map(response => response.json())
//         .map((response) => {
//           this.parseGeoloc(response);
//         })
//         .catch(this.handleErrors);
//     })
//   })
// }
  getGeoLocation () {
        if (!geolocation.isEnabled()) {
            geolocation.enableLocationRequest();
        }         
        //return geolocation.getCurrentLocation({ desiredAccuracy: enums_1.Accuracy.high, updateDistance: 0.1, maximumAge: 5000, timeout: 20000 })    
        return {latitude: 51.109843, longitude:17.033244};
  }

  getNearbyAirports(limit = "1") {
    const result = this.getGeoLocation()
    let params: URLSearchParams = new URLSearchParams;
    params.set('apikey', Password.apikey);
    params.set('latitude', result.latitude + "")
    params.set('longitude',  result.longitude + "")
    params.set('limit', limit)
    this.options.search = params;
    return this.http.get(
      Config.apiUrl + "geolocation/3/nearbyAirports",
      this.options
    )
    .map(response => response.json())
    .map((response) => {
      this.parseGeoloc(response);
    })
      .catch(this.handleErrors);
  }

  parseGeoloc(response) {
    this.airportList = response.map(airport => {
      return new Airport(airport.iataCode, airport.name)         
    });
    //return this.airportList;
    //this.zone.run(() => {
    //  this.airports.next([...this.airportList]);
    //});
    this.airports.next([...this.airportList]);
  }


  getAllFlights(airport, departureMin, departureMax, returnMin, returnMax) {
    let params: URLSearchParams = new URLSearchParams;
    params.set('apikey', Password.apikey);
    params.set('departureAirportIataCode', airport)
    params.set('outboundDepartureDateFrom', departureMin)
    params.set('outboundDepartureDateTo', departureMax)
    params.set('inboundDepartureDateFrom', returnMin)
    params.set('inboundDepartureDateTo', returnMax)
    this.options.search = params;
    return this.http.get(
      Config.apiUrl + "farefinder/3/roundTripFares",
      this.options
    )
    .map(response => response.json())
    .map((response) => {
      this.parseFlights(response);
    })
    .catch(this.handleErrors);
  }

   parseFlights(response) {
    this.flightList = response.fares.map(route => {
      return new Flight(route)         
    });
    this.zone.run(() => {
      this.flights.next([...this.flightList]);
    });
    //return this.flightList;
  }

  handleErrors(error: Response) {
    console.dump(error);
    return Observable.throw(error);
  }
}