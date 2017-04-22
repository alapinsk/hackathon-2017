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
  private currentAirportCode: string;

  constructor(private options: RequestOptions, private http: Http, private zone: NgZone) {}


  setCurrentAirportCode(value: string){
    let airport: Airport[] = this.airportList.filter((airport) => { return airport.name = value});
    this.currentAirportCode = airport[0].code;
  }
  getGeoLocation () {
        if (!geolocation.isEnabled()) {
            geolocation.enableLocationRequest();
        }         
       return new Observable<any> ((observer: any) => {
            geolocation.getCurrentLocation({ desiredAccuracy: enums_1.Accuracy.high, updateDistance: 0.1, maximumAge: 5000, timeout: 20000 })    
             .then((result) => {
                 observer.next(result);
          })
      }).share()
}
  
  getNearbyAirports(location, limit = "1") {
        let params: URLSearchParams = new URLSearchParams;
        params.set('apikey', Password.apikey);
        params.set('latitude', location.latitude + "")
        params.set('longitude',  location.longitude + "")
        params.set('limit', limit)
        this.options.search = params;
        return this.http.get(
          Config.apiUrl + "geolocation/3/nearbyAirports",
          this.options
        )
        .map(response => response.json())
        .map((response) => {
          this.publishAirports(response);
        })
  }

getAllFlights( dates) {
    let params: URLSearchParams = new URLSearchParams;
    params.set('apikey', Password.apikey);
    params.set('departureAirportIataCode', this.currentAirportCode)
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
      console.log("flights")
      this.publishFlights(response);
    })
    .catch(this.handleErrors);
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
      //console.log(JSON.stringify(response))
      let weather = new Weather(response);
      console.log(weather.desc);
      return weather;
    })
    .catch(this.handleErrors);
  }


 publishAirports(response){
   this.airportList = response.map(airport => {
            return new Airport(airport.iataCode, airport.name)         
   });
   this.currentAirportCode = this.airportList[0].code;
   
   this.zone.run(() => {
      this.airports.next([...this.airportList]);
   });
 }

 publishFlights(response){
   this.flightList = [];
   response.fares.forEach(route => {
      let flight =  new Flight(route) 
      this.getWeather(flight.outbound.destination).subscribe((weather) => {
         console.log("woooot!")
         flight.weather = weather; 
         this.flightList.push(flight)
         
       },(error)=>{},()=>{
         this.zone.run(() => {
          this.flights.next([...this.flightList]);
        });
      }) 
    });
 }



  // getGeoLocation () {
  //       if (!geolocation.isEnabled()) {
  //           geolocation.enableLocationRequest();
  //       }         
  //       //return geolocation.getCurrentLocation({ desiredAccuracy: enums_1.Accuracy.high, updateDistance: 0.1, maximumAge: 5000, timeout: 20000 })    
  //       return {latitude: 51.109843, longitude:17.033244};
  // }

  // getNearbyAirports(limit = "1") {
  //   const result = this.getGeoLocation()
  //   let params: URLSearchParams = new URLSearchParams;
  //   params.set('apikey', Password.apikey);
  //   params.set('latitude', result.latitude + "")
  //   params.set('longitude',  result.longitude + "")
  //   params.set('limit', limit)
  //   this.options.search = params;
  //   return this.http.get(
  //     Config.apiUrl + "geolocation/3/nearbyAirports",
  //     this.options
  //   )
  //   .map(response => response.json())
  //   .map((response) => {
  //     this.parseGeoloc(response);
  //   })
  //     .catch(this.handleErrors);
  // }


   

  handleErrors(error: Response) {
    console.dump(error);
    return Observable.throw(error);
  }
}