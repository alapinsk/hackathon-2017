import { platformNativeScriptDynamic, NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NgModule } from "@angular/core";
import { AppRoutes, AppComponents } from "./app.routing";
import { AppComponent } from "./app.component";
import { BackendService } from "./shared";

@NgModule({
    declarations: [AppComponent, ...AppComponents],
    bootstrap: [AppComponent],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptHttpModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(AppRoutes)
    ],
    providers: [BackendService]
})
class AppComponentModule {}

platformNativeScriptDynamic().bootstrapModule(AppComponentModule);