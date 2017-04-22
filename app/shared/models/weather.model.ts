export class Weather {
    temp: string
    desc: string;

    constructor (weather) {
        this.temp = weather.main.temp;
        this.desc = weather.weather[0].description;
    }

}