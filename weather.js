/* eslint-disable indent */
const formatDate = require('./date.js');

class Forecast {
    constructor(weatherData) {
        this.description = `Low of ${weatherData.low_temp} ℃.  High of ${weatherData.max_temp} ℃.  ${weatherData.weather.description}`;
        this.date = formatDate(weatherData.datetime);
        this.type = Forecast.weatherType(this.description);
    }
    static weatherType(description) {
        if (/sun/i.test(description)) {
            return 'sun';
        } else if (/clear/i.test(description)) {
            return 'clear';
        } else if (/rain/i.test(description)) {
            return 'rain';
        } else if (/cloud/i.test(description)) {
            return 'cloud';
        } else if (/thunder/i.test(description)) {
            return 'thunder';
        } else if (/snow/i.test(description) || /flurr/i.test(description)) {
            return 'snow';
        }
    }
}

module.exports = Forecast;

