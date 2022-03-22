'use strict';

require('dotenv').config();

const express = require('express');

const weatherData = require('./data/weather.json');


const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

class Forecast {
    static monthArr = ['January', 'February', 'March',
        'April', 'May', 'June', 'July', 'August', 'September',
        'October', 'November', 'December'];

    constructor(weatherData) {
        this.description = `Low of ${weatherData.low_temp} \u2109. High of ${weatherData.high_temp} \u2109. With a chance of ${weatherData.weather.description}`;
        this.date = Forecast.formatDate(weatherData.datetime);
        this.type = Forecast.weatherType(this.description);
    }
    static weatherType(description) {
        if (/sun/i.test(description)) {
            return 'sun';
        } else if (/rain/i.test(description)) {
            return 'rain';
        } else if (/cloud/i.test(description)) {
            return 'cloud';
        } else if (/thunder/i.test(description)) {
            return 'thunder';
        }
    }
    static formatDate(date) {
        const dateArr = date.split('-');
        const year = dateArr[0];
        const month = Forecast.findMonth(dateArr[1]);
        const day = dateArr[2];
        return `${month} ${day}, ${year}`;
    }
    static findMonth(month) {
        for (let i = 1; i <= 12; i++) {
            if (i == month) {
                return Forecast.monthArr[i];
            }
        }
    }
}

app.get('/weather', (req, res, next) => {
    try {
        const lat = parseInt(req.query.lat);
        const lon = parseInt(req.query.lon);
        const search = new RegExp(req.query.search, 'i');
        const weather = weatherData.find(value => {
            return search.test(value.city_name)
                || (lat === parseInt(value.lat) && lon === parseInt(value.lon))
        });
        if (weather) {
            const forecastArr = weather.data.map(value => {
                return new Forecast(value);
            });
            res.send(forecastArr);
        } else {
            throw 'city not found';
        }
    } catch (e) {
        console.log(e.message);
        res.send(e.message);
    }
});

app.get('/', (req, res, next) => {
    res.send('Server is live');
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));




