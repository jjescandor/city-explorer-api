'use strict';

require('dotenv').config();

const express = require('express');

const weatherData = require('./data/weather.json');

console.log(weatherData);

const cors = require('cors');
const { describe } = require('eslint/lib/rule-tester/rule-tester');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

console.log(process.env.PORT);

class Forecast {
    constructor(weatherData) {
        this.description = `Low of ${weatherData.low_temp}. High of ${weatherData.high_temp}. With a chance of ${weatherData.weather.description}`;
        this.date = weatherData.datetime;
    }
}

app.get('/weather', (req, res, next) => {
    try {
        const query = req.query.type;
        const weather = weatherData.find(value => {
            return parseInt(value.lat) === parseInt(query[0]);
        });
        const forecastArr = weather.data.map(value => {
            return new Forecast(value);
        });
        res.send(forecastArr);
    } catch (e) {
        res.send(e.message);
    }
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));




