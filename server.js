'use strict';

require('dotenv').config();

const express = require('express');

//const weatherData = require('./data/weather.json');


const cors = require('cors');
const { default: axios } = require('axios');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

const monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

const formatDate = (date) => {
    const dateArr = date.split('-');
    const year = dateArr[0];
    const month = findMonth(dateArr[1]);
    const day = dateArr[2];
    return `${month} ${day}, ${year}`;
}
const findMonth = (month) => {
    for (let i = 1; i <= 12; i++) {
        if (i == month) {
            return monthArr[i];
        }
    }
}

class Forecast {
    constructor(weatherData) {
        this.description = `Low of ${weatherData.temp} \u2109. Temp ${weatherData.temp} \u2109. ${weatherData.weather.description}`;
        this.date = formatDate(weatherData.datetime);
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
}

class Movies {
    constructor(movieData) {
        this.title = movieData.original_title;
        this.overview = movieData.overview;
        this.img_url = movieData.backdrop_path;
        this.rating = movieData.vote_average;
        this.release_date = formatDate(movieData.release_date);
    }
}

const findWeatherForecast = async (req, res, next) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
    const weatherData = await axios.get(url);
    const weather = weatherData.data.data.slice(0, 7);
    try {
        if (weather) {
            const forecastArr = weather.map(value => {
                return new Forecast(value);
            });
            res.send(forecastArr);
        } else {
            throw 'city not found';
        }
    } catch (e) {
        res.send(e.message);
    }
}


app.get('/weather', findWeatherForecast);


const findMovies = async (req, res, next) => {
    const movieQuery = req.query.query;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${movieQuery}&page=1`;
    const movies = await axios.get(url);
    const movieResults = movies.data.results.slice(0, 10).map(value => new Movies(value));
    res.send(movieResults);
}


app.get('/movies', findMovies);


app.get('/', (req, res, next) => {
    res.send('Server is live');
});

app.listen(3001, () => console.log(`listening on PORT ${PORT}`));




