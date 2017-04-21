import {Component, OnInit, ChangeDetectionStrategy, EventEmitter} from "@angular/core";
import {Location} from "@angular/common";
import {Http, Headers, RequestOptions} from "@angular/http"
import {Router} from "@angular/router";

import * as Utility from "utils/utils";
import { BackendService } from "../../shared";


@Component({
    selector: "page1",
    templateUrl: "./components/page1/page1.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Page1 implements OnInit {

    public constructor(private router: Router, private http: Http, 
                       private location: Location, private backendService: BackendService) {
        
    }

    public ngOnInit() {
        this.location.subscribe(() => { //on return load again 
            this.loadData();
        });
        this.loadData();
    }

    

    
    private loadData() {
        this.backendService.getNearbyAirports()
        .subscribe(
            (result) => {
                // console.log("Success! ")
                // console.dump(result);
                this.backendService.airports.subscribe((result) => {
                    this.loadFlights(result[0].code);
                })
                
            },
            (error) => {
            alert("An error occured!" + error);
            }
        );
    }

     private loadFlights(airport) {
        this.backendService.getAllFlights(airport, "2017-04-28", "2017-04-29", "2017-04-29", "2017-04-30")
        .subscribe(
            (result) => {
                // console.log("Success! ")
                // console.dump(result);
            },
            (error) => {
            alert("An error occured!" + error);
            }
        );
    }

    private loadTestData(){
        
    }
    

    public navigateToPage2() {
        this.router.navigate(["page2"]);
    }

    public doSomething() {

        alert("Bum bum!");
        
    }

}
