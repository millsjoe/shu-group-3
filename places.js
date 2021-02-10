

const request = require("request");
const syncRequest = require("sync-request");
const fs = require('fs');
let api = 'AIzaSyBJFVNTYNGzjI4nayUMxq6DcW66eCpB1rU';

function postCodeToLatLong(postcode) {
    const postCodeToUse = postcode.trim();
    const res = syncRequest('GET', `http://api.getthedata.com/postcode/${postCodeToUse}`);
    const data = JSON.parse(res.getBody());

    return {
        lat : data.data.latitude,
        long : data.data.longitude
    }
}

function findCoffeShops() {
    let coffeeShops = [];
    const data = fs.readFileSync('sample.json'); 
    const info = JSON.parse(data);
    info.results.forEach(place => {
        coffeeShops.push(
        {
            name : place.name,
            address : place.formatted_address
        }
        );
    });
    return coffeeShops;
}

function webCoffeeShops(lat, long) {
    request(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=coffee+shop&location=${lat},${long}&radius=5&type=cafe&key=${api}`, (error, res, body) => {
        let nearestCoffee  = []
        const data = JSON.parse(body);
        data.results.forEach(shop => {
            nearestCoffee.push({
                name : shop.name,
                address : shop.formatted_address
            });
        })
    });
}

function getCoffeeShops(postcode) {
    const info = postCodeToLatLong(postcode);
    const lat = info.lat;
    const long = info.long;
    const res = syncRequest('GET',`https://maps.googleapis.com/maps/api/place/textsearch/json?query=coffee+shop&location=${lat},${long}&radius=5&type=cafe&key=${api}`);
    const data = JSON.parse(res.getBody());

    let shops = [];
    data.results.forEach(shop => {
        let currentImage = 'https://www.pngonly.com/wp-content/uploads/2017/05/Coffee-Clipart-PNG-Image-01.png'
        if (shop.photos != undefined) {
                currentImage = buildImgUrl(shop.photos[0].photo_reference);
        }
        shops.push(
            {
                name : shop.name,
                address : shop.formatted_address,
                imageURL : currentImage
            }
        );
    });

    return shops;

}

function buildImgUrl(reference) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&maxheight=500&photoreference=${reference}&key=${api}`
}

module.exports = { getCoffeeShops }