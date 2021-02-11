
const express = require("express");
const router = express.Router();
const googleAPIs = require('../places');
const bodyParser = require("body-parser");
const Shop = require('../models/Shops');
const { ensureAuthenticated } = require('../config/auth');

const Rating = require('../models/Rating')

//Welcome page (not logged in)
router.get('/', (req, res) => res.render('index'));

//Homepage (logged in)
router.get('/home', ensureAuthenticated, async (req, res) => {
    try {
        const ratings = await Rating.find({user: req.user.id})
        
        res.render('home', {
            name: req.user.name,
            ratings
        })
    }   catch (err) {
        console.error(err)
        //need to add error message
    }  
});

//Profile (logged in)
router.get('/profile', ensureAuthenticated, async (req, res) => {
    try {
        const ratings = await Rating.find({user: req.user.id})
        
        res.render('profile', {
            name: req.user.name,
            ratings
        })
    }   catch (err) {
        console.error(err)
        //need to add error message
    }  
});


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

module.exports = router;
