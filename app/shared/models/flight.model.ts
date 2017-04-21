import { Leg } from "./leg.model";

export class Flight {
    outbound: Leg
    inbound: Leg

    constructor (route) {
        this.outbound = new Leg(route.outbound);
        this.inbound = new Leg(route.inbound);
    }

}