/* eslint-disable indent */
const { default: axios } = require('axios');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 3600 });
const formatDate = require('./date.js');

class Movies {
    constructor(movieData) {
        this.title = movieData.original_title;
        this.overview = movieData.overview;
        this.img_url = `https://image.tmdb.org/t/p/w500${movieData.backdrop_path}`;
        this.poster = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
        this.rating = movieData.vote_average;
        this.release_date = formatDate(movieData.release_date);
    }
}

const findMovies = async (req, res) => {
    try {
        const { query } = req.query;
        if (myCache.has(query)) {
            const movies = myCache.get(query);
            const movieResults = movies.map(value => new Movies(value));
            res.status(200).send(movieResults);
        }
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${query}&page=1`;
        const movies = await axios.get(url);
        myCache.set(query, movies.data.results.slice(0, 10));
        const movieResults = movies.data.results.slice(0, 10).map(value => new Movies(value));
        res.status(200).send(movieResults);
    } catch (e) {
        res.send(e.message);
    }
};

module.exports = findMovies;
