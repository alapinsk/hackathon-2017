import {Component} from "@angular/core";
import {Location} from "@angular/common";
import {Router} from "@angular/router";
import * as Toast from 'nativescript-toast';

@Component({
    selector: "page2",
    templateUrl: "./components/page2/page2.component.html",
})
export class Page2 {

    public constructor(private location: Location, private router: Router) {
    }

    public test() {
        console.log("Bum bum bum!");
        Toast.makeText("Wooot!").show();
        this.location.back();
    }

}
