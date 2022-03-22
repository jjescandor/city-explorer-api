'use strict';

require('dotenv').config();

const express = require('express');

const weatherData = require('./data/weather.json');

const axios = require('axios');

const cors = require('cors');

const app = express();

app.use(cors());

const PORT = 3003;

class Forecast {
    static monthArr = ['January', 'February', 'March',
        'April', 'May', 'June', 'July', 'August', 'September',
        'October', 'November', 'December'];

    constructor(weatherData) {
        this.description = `Low of ${weatherData.low_temp}. High of ${weatherData.high_temp}. With a chance of ${weatherData.weather.description}`;
        this.date = this.formatDate(weatherData.datetime);
        this.type = this.weatherType();
    }
    weatherType() {
        if (/sun/i.test(this.description)) {
            return 'sun';
        } else if (/rain/i.test(this.description)) {
            return 'rain';
        } else if (/cloud/i.test(this.description)) {
            return 'cloud';
        } else if (/thunder/i.test(this.description)) {
            return 'thunder';
        }
    }
    formatDate(date) {
        const dateArr = date.split('-');
        const year = dateArr[0];
        const month = this.findMonth(dateArr[1]);
        const day = dateArr[2];
        return `${month} ${day}, ${year}`;
    }
    findMonth(month) {
        for (let i = 1; i <= 12; i++) {
            if (i == month) {
                return Forecast.monthArr[i];
            }
        }
    }
}

const getWeather = async () => {
    const url = ``;
    return url;
}

const getMovies = async () => {
    const url = ``;
    return url;
}



app.get('/weather', (req, res) => {
    try {
        const lat = parseInt(req.query.lat);
        const lon = parseInt(req.query.lon);
        const search = new RegExp(req.query.search, 'i');
        const weather = getWeather();
        if (weather) {
            const forecastArr = weather.data.map(value => {
                return new Forecast(value);
            });
            res.send(forecastArr);
        } else {
            throw 'error';
        }
    } catch (e) {
        res.send(e.message);
    }
});

app.get('/movies', (req, res) => {
    res.send('Server is live');
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));




