

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
        console.log(nearestCoffee);
    });
}


console.log(postCodeToLatLong('WF140QZ').lat);

console.log(postCodeToLatLong('WF140QZ').long);