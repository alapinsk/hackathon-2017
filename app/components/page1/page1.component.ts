import {Component, OnInit, ChangeDetectionStrategy, EventEmitter, Input} from "@angular/core";
import {Location} from "@angular/common";
import {Http, Headers, RequestOptions} from "@angular/http"
import {Router} from "@angular/router";
import * as listViewModule from "ui/list-view";

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

    @Input() row;

    selectedWeekend: string = "20/12/2017 - 22/12/2017";
    currentWeek: number = 0;
    format: string = "YYYY-MM-DD"
    airport: string = "";
    airportCode: string = "";

    public constructor(private router: Router, private http: Http, 
                       private location: Location, private backendService: BackendService) {
        
    }

    public ngOnInit() {
        console.log("OnInit")
        this.backendService.loadData(this.getWeekend());
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
            this.backendService.loadData(this.getWeekend());
        }
        else {
            this.currentWeek = (this.currentWeek === 0) ? 0 : this.currentWeek - 1;
            this.backendService.loadData(this.getWeekend());
        }
    }

    public navigateToPage2() {
        this.backendService.resetFlights();
        this.router.navigate(["page2"]);
    }

    public doSomething() {

        alert("Bum bum!");
        
    }

     getImage(nameFile: string = "waw"): string {
        return `~/images/${nameFile}.jpg`;
    }

}
