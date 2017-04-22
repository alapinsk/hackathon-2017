import { Leg } from "./leg.model";

export class Flight {
    outbound: Leg;
    inbound: Leg;
    totalPrice: number;
    currency: string;

    constructor (route) {
        this.outbound = new Leg(route.outbound);
        this.inbound = new Leg(route.inbound);
        this.totalPrice = route.summary.price.value;
        this.currency = route.summary.price.currencySymbol;
    }

}