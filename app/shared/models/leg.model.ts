let moment = require("moment")

export class Leg {
    code: string;
    destination: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    currency: string;
    ryrDate: string;
    

    constructor (leg) {
        this.code = leg.arrivalAirport.iataCode.toLowerCase()
        this.destination = leg.arrivalAirport.name;
        const departureDate = moment(leg.departureDate);
        const arrivalDate = moment(leg.arrivalDate);
        this.departureTime = departureDate.format("HH:mm");
        this.arrivalTime = arrivalDate.format("HH:mm");
        this.date = departureDate.format("Do MMM YYYY");
        this.price = leg.price.value;
        this.currency = leg.price.currencySymbol;
        this.ryrDate = departureDate.format('DD/MM/YYYY');
    }
} 