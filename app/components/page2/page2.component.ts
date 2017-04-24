import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import { BackendService } from "../../shared";
import { Page } from "ui/page";
import { Airport } from "../../shared/models/airport.model";

@Component({
    selector: "page2",
    templateUrl: "./components/page2/page2.component.html",
    styleUrls: ["./components/page2/page2.component.css"]
})
export class Page2 implements OnInit {

    public constructor(private location: Location, private router: RouterExtensions, 
                       private backendService: BackendService, private page: Page) {
                        
    }

    ngOnInit(){
        this.page.actionBarHidden = true;  
    }

    public changeAirport(value: Airport) {
        this.backendService.setCurrentAirport(value);
        this.router.navigate(["page1"], { clearHistory: true });
    }

}
