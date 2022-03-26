/* eslint-disable indent */
'use strict';

require('dotenv').config();

const express = require('express');

const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

const findWeatherForecast = require('./weather.js');

const findMovies = require('./movie.js');

app.get('/weather', findWeatherForecast);

app.get('/movies', findMovies);

app.get('/', (req, res) => {
    res.send('Server is live');
});

app.get('*', (req, res) => {
    res.send('Page Not Found');
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));




