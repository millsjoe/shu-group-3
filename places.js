const request = require("request");
const syncRequest = require("sync-request");
const { get } = require("https");
let api = 'AIzaSyBJFVNTYNGzjI4nayUMxq6DcW66eCpB1rU';

function postCodeToLatLong(postcode) {
    const postCodeToUse = postcode.trim();
    const res = syncRequest('GET', `http://api.getthedata.com/postcode/${postCodeToUse}`);
    const data = JSON.parse(res.getBody());

    return {
        lat : data.data.latitude,
        long : data.data.longitude
    };
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