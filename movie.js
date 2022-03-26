/* eslint-disable indent */
const formatDate = require('./date.js');

class Movies {
    constructor(movieData) {
        this.title = movieData.original_title;
        this.overview = movieData.overview;
        this.img_url = `https://image.tmdb.org/t/p/w500${movieData.backdrop_path}`;
        this.rating = movieData.vote_average;
        this.release_date = formatDate(movieData.release_date);
    }
}

module.exports = Movies;
