/* eslint-disable indent */
const { default: axios } = require('axios');

class Restaurants {
    constructor(restaurant) {
        this.name = restaurant.name;
        this.img = restaurant.image_url;
        this.link = restaurant.url;
        this.categories = restaurant.categories;
        this.rating = restaurant.rating;
        this.address = restaurant.location.display_address.;
        this.phone = restaurant.display_phone;
    }
}

const findRestaurants = async (req, res) => {
    const { lat, lon } = req.query;
    const config = {
        headers:
        {
            Authorization: `Bearer ${process.env.YELP_API_KEY}`
        }
    };
    const url = `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}&term=restaurants`;
    const restaurant = await axios.get(url, config);
    const resData = restaurant.data.businesses.filter(value => value.is_closed === false);
    const resArr = resData.slice(0, 10).map(restaurant => new Restaurants(restaurant));
    res.send(resArr);
};

module.exports = findRestaurants;
