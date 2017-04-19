import { Injectable, NgZone } from "@angular/core";
import { Http, Headers, Response, ResponseOptions } from "@angular/http";
import { Observable, BehaviorSubject } from "rxjs/Rx";
import "rxjs/add/operator/map";

import { BackendService, FirebaseService } from "../../shared";
import { Flight } from "./flight.model";
import * as firebase from "nativescript-plugin-firebase";

@Injectable()
export class flightService {
  items: BehaviorSubject<Array<Flight>> = new BehaviorSubject([]);

  private allItems: Array<Flight> = [];

  constructor(private http: Http, private zone: NgZone) { }


  load(): Observable<any> {
    return new Observable((observer: any) => {
      let path = 'Flights';
      
        let onValueEvent = (snapshot: any) => {
          this.zone.run(() => {
             let results = this.handleSnapshot(snapshot.value);
             observer.next(results);
          });
        };
        firebase.addValueEventListener(onValueEvent, `/${path}`);
    }).share();              
  }

  add(name: string) {   
    return firebase.push(
        "/Flights",
        { "name": name, "UID": BackendService.token, "done":false, "deleted":false }
      );
  }

  setDeleteFlag(item: Flight){
    this.publishUpdates();
    return firebase.update("/Flights/"+item.id+"",{
        deleted: item.deleted, 
        done: item.done})
      .then(
        function (result:any) {
          return 'You have successfully edited this flight!';
        },
        function (errorMessage:any) {
          console.log(errorMessage);
        });  
  }


  toggleDoneFlag(item: Flight){
    item.done = !item.done;
    this.publishUpdates();
    return firebase.update("/Flights/"+item.id+"",{
        done: item.done
      })
      .then(
        function (result:any) {
          return 'You have successfully edited this flight!';
        },
        function (errorMessage:any) {
          console.log(errorMessage);
        });  
  }


  permanentlyDelete(item: Flight) {
    return firebase.remove("/Flights/"+item.id+"").then(function(result){
        console.log(item.id +" was deleted. items value: ");
        
      }
    ).catch(this.handleErrors);
  }


  handleSnapshot(data: any) {
    //empty array, then refill and filter
    this.allItems = [];
    if (data) {
      for (let id in data) {        
        let result = (<any>Object).assign({id: id}, data[id]);
        if(BackendService.token === result.UID){
          this.allItems.push(result);
        }     
      }
      this.publishUpdates();   
    }
    return this.allItems;
  }

   publishUpdates() {
    // here, we sort must emit a *new* value (immutability!)
    this.items.next([...this.allItems]);
  }



  private getHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + BackendService.token);
    return headers;
  }

  private handleErrors(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}