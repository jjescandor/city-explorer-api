/* eslint-disable indent */

const { default: axios } = require('axios');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 3600 });

const formatDate = require('./date.js');

class Forecast {
    constructor(weatherData) {
        this.description = `Low of ${weatherData.low_temp} ℃.  High of ${weatherData.max_temp} ℃.  ${weatherData.weather.description}`;
        this.date = formatDate(weatherData.datetime);
        this.type = this.description;
        this.icon = `https://www.weatherbit.io/static/img/icons/${weatherData.weather.icon}.png`;
    }
}

const findWeatherForecast = async (req, res) => {
    const { lat, lon } = req.query;
    if (myCache.has(lat + lon)) {
        const weatherCont = myCache.get(lat + lon);
        const forecastArr = weatherCont.map(value => new Forecast(value));
        res.status(200).send(forecastArr);
    }
    const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
    const weatherData = await axios.get(url);
    const weatherCont = weatherData.data.data.slice(0, 7);
    try {
        if (weatherCont) {
            myCache.set(lat, weatherCont);
            const forecastArr = weatherCont.map(value => new Forecast(value));
            res.status(200).send(forecastArr);
        } else {
            throw 'city not found';
        }
    } catch (e) {
        res.send(e.message);
    }
};

module.exports = findWeatherForecast;

