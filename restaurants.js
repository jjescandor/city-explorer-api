/* eslint-disable indent */
const { default: axios } = require('axios');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 300 });

class Restaurants {
    constructor(restaurant) {
        this.name = restaurant.name;
        this.img = restaurant.image_url;
        this.link = restaurant.url;
        this.categories = restaurant.categories;
        this.rating = parseInt(restaurant.rating);
        this.address = restaurant.location.display_address;
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
    if (myCache.has(lat + lon)) {
        const resArr = myCache.get(lat + lon);
        console.log('cache-hit');
        res.status(200).send(resArr);
    } else {
        const url = `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}&term=restaurants`;
        const restaurant = await axios.get(url, config);
        const resData = restaurant.data.businesses.filter(value => value.is_closed === false);
        const resArr = resData.slice(0, 10).map(restaurant => new Restaurants(restaurant));
        myCache.set(lat + lon, resArr);
        console.log('cache-nohit');
        res.send(resArr);
    }
};

module.exports = findRestaurants;

