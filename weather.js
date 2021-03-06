/* eslint-disable indent */

const { default: axios } = require('axios');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 300 });
const formatDate = require('./date.js');

class Forecast {
    constructor(weatherData) {
        this.description = `Low of ${weatherData.low_temp} ℃.  High of ${weatherData.max_temp} ℃.  ${weatherData.weather.description}`;
        this.date = formatDate(weatherData.datetime);
        this.type = this.description;
        this.icon = `https://www.weatherbit.io/static/img/icons/${weatherData.weather.icon}.png`;
        this.sourceDate = convertDate(Date.now());
    }
}

function convertDate(rawDate) {
    const date = new Date(rawDate);
    return date.toString();
}

const findWeatherForecast = async (req, res) => {
    const { lat, lon } = req.query;
    if (myCache.has(lat + lon)) {
        const forecastArr = myCache.get(lat + lon);
        console.log('cache-hit');
        res.status(200).send(forecastArr);
    } else {
        const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
        const weatherData = await axios.get(url);
        const weatherCont = weatherData.data.data.slice(0, 7);
        try {
            if (weatherCont) {
                const forecastArr = weatherCont.map(value => new Forecast(value));
                myCache.set(lat + lon, forecastArr);
                console.log('cache-nohit');
                res.status(200).send(forecastArr);
            } else {
                throw 'city not found';
            }
        } catch (e) {
            res.send(e.message);
        }
    }
};

module.exports = findWeatherForecast;

