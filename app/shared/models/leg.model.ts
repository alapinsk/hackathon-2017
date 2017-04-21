let moment = require("moment")

export class Leg {
    destination: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    price: {
        value: number;
        currencySymbol: string;
    }

    constructor (leg) {
        this.destination = leg.arrivalAirport.name;
        const departureDate = moment(leg.departureDate);
        const arrivalDate = moment(leg.arrivalDate);
        this.departureTime = departureDate.format("HH:mm");
        this.arrivalTime = arrivalDate.format("HH:mm");
        this.date = departureDate.format("Do MMM YYYY");
        this.price = { value: leg.price.value, currencySymbol: leg.price.currencySymbol };
    }
} 