export class Weather {
    temp: string;
    desc: string;

    constructor (weather) {
        if(weather){
            this.temp = weather.main.temp;
            this.desc = weather.weather[0].description;
        }
        else{
            this.temp = "";
            this.desc = "";
        }
    }

}