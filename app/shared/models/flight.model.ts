import { Leg } from "./leg.model";
import { Weather } from "./weather.model";

export class Flight {
    outbound: Leg;
    inbound: Leg;
    totalPrice: number;
    currency: string;
    weather: Weather;
    beer: number;

    constructor (route) {
        this.outbound = new Leg(route.outbound);
        this.inbound = new Leg(route.inbound);
        this.totalPrice = route.summary.price.value;
        this.currency = route.summary.price.currencySymbol;
        this.beer = Math.floor(Math.random() * 10 + 1);
        
        this.weather = new Weather("");
    }

}