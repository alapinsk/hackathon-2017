import { Injectable , NgZone} from "@angular/core";
import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";

import { Observable, BehaviorSubject } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { Password } from "../password";
import { Config } from "./config";
import { Airport } from "./models/airport.model";
import { Flight } from "./models/flight.model";
import { Weather } from "./models/weather.model";

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
    this.zone.run(() => {
     this.airports.next([...this.airportList]);
    });
    this.airports.next([...this.airportList]);
  }


  getAllFlights(airport, dates) {
    let params: URLSearchParams = new URLSearchParams;
    params.set('apikey', Password.apikey);
    params.set('departureAirportIataCode', airport)
    params.set('outboundDepartureDateFrom', dates[0])
    params.set('outboundDepartureDateTo', dates[1])
    params.set('inboundDepartureDateFrom', dates[2])
    params.set('inboundDepartureDateTo', dates[3])
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
    this.flightList = []
    response.fares.forEach(route => {
       this.getWeather(route.outbound.arrivalAirport.name).subscribe((weather) => {
          let flight =  new Flight(route)  
          flight.weather = weather;
          this.flightList.push(flight)
           this.zone.run(() => {
          this.flights.next([...this.flightList]);
        });
       })

    });
   
    //return this.flightList;
  }

   getWeather(airport) {
    let params: URLSearchParams = new URLSearchParams;
    params.set('APPID', Password.wheatherApikey);
    params.set('q', airport)
    params.set('units', "metric")
    this.options.headers["Content-Type"] = "application/json"
    this.options.search = params;
    return this.http.get(
      "http://api.openweathermap.org/data/2.5/weather",
      this.options
    )
    .map(response => response.json())
    .map((response) => {
      return this.parseWeather(response);
    })
    .catch(this.handleErrors);
  }

  parseWeather(response) {
    return new Weather(response)
   
  }

  handleErrors(error: Response) {
    console.dump(error);
    return Observable.throw(error);
  }
}