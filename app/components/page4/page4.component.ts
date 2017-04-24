import {Component} from "@angular/core";
import {Location} from "@angular/common";
import {Http, Headers, RequestOptions} from "@angular/http";
import * as Toast from 'nativescript-toast';

@Component({
    selector: "page4",
    templateUrl: "./components/page4/page4.component.html",
})
export class Page4 {

    public constructor(private location: Location, private http: Http) {
    }

    public test() {
        console.log("Bum bum bum!");
        Toast.makeText("Wooot!").show();
        this.location.back();
    }

}
