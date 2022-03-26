/* eslint-disable indent */
'use strict';

require('dotenv').config();

const express = require('express');

const cors = require('cors');

const { default: axios } = require('axios');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

const Forecast = require('./weather.js');

const Movies = require('./movie.js');

const findWeatherForecast = async (req, res) => {
    const { lat, lon } = req.query;
    const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
    const weatherData = await axios.get(url);
    const weatherCont = weatherData.data.data.slice(0, 7);
    try {
        if (weatherCont) {
            const forecastArr = weatherCont.map(value => new Forecast(value));
            res.status(200).send(forecastArr);
        } else {
            throw 'city not found';
        }
    } catch (e) {
        res.send(e.message);
    }
};

app.get('/weather', findWeatherForecast);

const findMovies = async (req, res) => {
    try {
        const { query } = req.query;
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${query}&page=1`;
        const movies = await axios.get(url);
        const movieResults = movies.data.results.slice(0, 10).map(value => new Movies(value));
        res.status(200).send(movieResults);
    } catch (e) {
        res.send(e.message);
    }
};

app.get('/movies', findMovies);

app.get('/', (req, res) => {
    res.send('Server is live');
});

app.get('*', (req, res) => {
    res.send('Page Not Found');
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));




