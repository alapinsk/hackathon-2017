import {Component, ElementRef, ViewChild, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Http, Headers, RequestOptions} from "@angular/http"
import {Router} from "@angular/router";
import { Animation } from "ui/animation";
import { View } from "ui/core/view";
import { Page } from "ui/page";
import * as Utility from "utils/utils";

@Component({
    selector: "page0",
    templateUrl: "./components/page0/page0.component.html",
    styleUrls: ["./components/page0/page0-common.css", "./components/page0/page0.component.css"]
})
export class Page0 implements OnInit {
    @ViewChild("initialContainer") initialContainer: ElementRef;
    @ViewChild("logoContainer") logoContainer: ElementRef;

    public constructor(private router: Router,
    private page: Page) {
        
    }

    ngOnInit() {
         this.page.actionBarHidden = true;
    }

    public navigateToPage1() {
        this.router.navigate(["page1"]);
    }

    startBackgroundAnimation(background) {
        background.animate({
        scale: { x: 1.0, y: 1.0 },
        duration: 10000
        });
    }

}
