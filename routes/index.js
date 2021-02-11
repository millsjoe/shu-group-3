const express = require('express');
const googleAPIs = require('../places');
const router = express.Router();
const bodyParser = require("body-parser");
const Shop = require('../models/Shops');

let max = 5;
let shops = [];
router.get('/', (req, res) => res.render('index'));

router.get('/home', (req, res) => {
    res.render('home');
});

const checkUserPassword = function (username, password) {
  // return password == getUsersPassword(username)
  return hashString(password) == getUsersPassword(username);
};

const hashString = function (string) {
  return crypto.createHash("sha256").update(string).digest("hex");
};

router.post('/', (req, res) => {
    const { postCode } = req.body;

    Shop.find({ postcodes: postCode}).then(shop => {
        if (shop.length != 0){
            shops = shop;
            const toReturn = getLocalShops(max);
            res.render('shops', {shops: toReturn})
        } else {
            setLocalShops(postCode);
            const networkShops = shops;

            networkShops.forEach(newShopFromCall => {
                Shop.findOne({ id: newShopFromCall.id}).then(newShop => {
                    if (newShop) {
                        Shop.updateOne({id : newShop.id}, {$push: {postcodes : postCode}}).then(nothing => {
                            console.log(`Added ${postCode} to ${newShop.id}`);
                        });

                    } else {
                        const id = newShopFromCall.id;
                        const name =    newShopFromCall.name;
                        const address = newShopFromCall.address;
                        const imageurl = newShopFromCall.imageURL;
                        const lat = newShopFromCall.lat;
                        const lng = newShopFromCall.lng;
                        const postcodes = newShopFromCall.postcodes;
                        const newShopToDB = new Shop({
                            id,
                            name,
                            address,
                            imageurl,
                            lat,
                            lng,
                            postcodes
                        });
                        newShopToDB.save((err, shop) => {
                            if (err) console.error(err);
                        });
                    }
                });
            });
            const toReturn = getLocalShops(max);
            res.render('shops', {shops: toReturn});
        }
    });
});

router.post('/shops', (req, res) => {
    increaseLimit();
    const shopsToReturn = getLocalShops(max);
    res.render('shops', {shops: shopsToReturn});
});

module.exports = router;

function setLocalShops(postcode) {
    shops = googleAPIs.getCoffeeShops(postcode);
}

function getLocalShops(numShops) {
    return shops.slice(1,numShops);
}

function increaseLimit() {
    if (max <= shops.length){
        max += 5;
    }
}
