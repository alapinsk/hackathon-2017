import {Component, OnInit, ChangeDetectionStrategy, EventEmitter} from "@angular/core";
import {Location} from "@angular/common";
import {Http, Headers, RequestOptions} from "@angular/http"
import {Router} from "@angular/router";

import * as Utility from "utils/utils";
import { BackendService } from "../../shared";

import * as elementRegistryModule from "nativescript-angular/element-registry";
elementRegistryModule.registerElement("CardView", () => require("nativescript-cardview").CardView);

import * as moment from "moment"

@Component({
    selector: "page1",
    styleUrls: ["./components/page1/page1.component.css"],
    templateUrl: "./components/page1/page1.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Page1 implements OnInit {

    selectedWeekend = "20/12/2017 - 22/12/2017";
    currentWeek = 0;
    format = "YYYY-MM-DD"
    airport;
    airportCode;

    public constructor(private router: Router, private http: Http, 
                       private location: Location, private backendService: BackendService) {
        
    }

    public ngOnInit() {
        this.location.subscribe(() => { //on return load again 
            this.getWeekend();
            this.loadData();
        });
        this.getWeekend();
        this.loadData();
    }
    
    private loadData() {
        this.backendService.getNearbyAirports()
        .subscribe(
            (result) => {
                // console.log("Success! ")
                // console.dump(result);
                this.backendService.airports.subscribe((result) => {
                    this.airport = result[0].name;
                    this.airportCode = result[0].code;
                    this.loadFlights(this.airportCode);
                })
                
            },
            (error) => {
            alert("An error occured!" + error);
            }
        );
    }

     private loadFlights(airport) {
        this.backendService.getAllFlights(airport, this.getWeekend())
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

    getWeekend() {
        let week = ([5, 6, 7].indexOf(moment().isoWeekday()))? 1: 0;
        const outboundDateMin = moment().add(week + this.currentWeek, 'weeks').startOf('isoWeek').add('days', 4);
        const outboundDateMax = outboundDateMin.clone().add('days', 1);
        const inboundDateMin = outboundDateMax.clone();
        const inboundDateMax = inboundDateMin.clone().add('days', 1);
        this.selectedWeekend = `${outboundDateMin.format(this.format)} - ${inboundDateMax.format(this.format)}`;
        return [outboundDateMin.format(this.format), outboundDateMax.format(this.format), inboundDateMin.format(this.format), inboundDateMax.format(this.format)]
    }

    selectorWeekend(back = false) {
        if (!back) {
            this.currentWeek += 1
            this.loadFlights(this.airportCode);
        }
        else {
            this.currentWeek = (this.currentWeek === 0) ? 0 : this.currentWeek - 1;
            this.loadFlights(this.airportCode);
        }
    }

    public navigateToPage2() {
        this.router.navigate(["page2"]);
    }

    public doSomething() {

        alert("Bum bum!");
        
    }

     getImage(nameFile: string = "waw"): string {
        return `~/components/page1/images/${nameFile}.jpg`;
    }

}
