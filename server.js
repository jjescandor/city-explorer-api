'use strict';

require('dotenv').config();

const express = require('express');

const weatherData = require('./data/weather.json');

const cors = require('cors');
const { describe } = require('eslint/lib/rule-tester/rule-tester');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

class Forecast {
    constructor(weatherData) {
        this.description = `${weatherData.datetime}: Low of ${weatherData.low_temp}. High of ${weatherData.high_temp}. With a chance of ${weatherData.weather.description}`;
        this.date = weatherData.datetime;
    }
}

app.get('/weather', (req, res, next) => {
    try {
        const lat = parseInt(req.query.lat);
        const lon = parseInt(req.query.lon);
        const weather = weatherData.find(value => {
            return parseInt(value.lat) === lat
                && parseInt(value.lon) === lon;
        });
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

app.get('/', (req, res, next) => {
    res.send('Server is live');
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));




