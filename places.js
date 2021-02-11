const request = require("request");
const syncRequest = require("sync-request");
const { get } = require("https");
let api = ''; //INSERT API HERE (MESSAGE JOE)

// Convert postcode to lat + long
function postCodeToLatLong(postcode) {
    const postCodeToUse = postcode.trim();
    const res = syncRequest('GET', `http://api.getthedata.com/postcode/${postCodeToUse}`);
    const data = JSON.parse(res.getBody());

    return {
        lat : data.data.latitude,
        long : data.data.longitude
    };
}

// Gets coffee shops via Google API - returns an object of shops
function getCoffeeShops(postcode) {
    const info = postCodeToLatLong(postcode);
    const lat = info.lat;
    const long = info.long;
    const res = syncRequest('GET',`https://maps.googleapis.com/maps/api/place/textsearch/json?query=coffee+shop&location=${lat},${long}&radius=5&type=cafe&key=${api}`);
    const data = JSON.parse(res.getBody());

    let shops = [];

    data.results.forEach(shop => {
        // Default image for shops without any image
        let currentImage = 'https://www.pngonly.com/wp-content/uploads/2017/05/Coffee-Clipart-PNG-Image-01.png'
        if (shop.photos != undefined) {
                const randomImage = randomArraySelect(shop.photos);
                currentImage = buildImgUrl(randomImage.photo_reference);
        }
        shops.push(
            {
                id : shop.place_id,
                name : shop.name,
                address : shop.formatted_address,
                imageURL : currentImage,
                lat : shop.geometry.location.lat,
                lng : shop.geometry.location.lng,
                postcodes : [postcode]
            }
        );
    });
    return shops;
}


function buildImgUrl(reference) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&maxheight=500&photoreference=${reference}&key=${api}`
}

function randomArraySelect(array) {
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = { getCoffeeShops }


// function exportAsJSON(arrayThing) {
//     const data = JSON.stringify(arrayThing);

//     try {
//         fs.writeFileSync('./sampleShops.json', data);
//         console.log('File written');
//     } catch {
//         console.log('Failed to write to file');
//     }
// }