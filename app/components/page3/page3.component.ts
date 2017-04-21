import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Router} from "@angular/router";
import * as Utility from "utils/utils";

@Component({
    selector: "page3",
    templateUrl: "./components/page3/page3.component.html",
})
export class Page3 {

    public doSomething() {

        alert("Bum bum!");
        
    }

}
