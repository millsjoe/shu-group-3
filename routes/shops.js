const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const googleAPIs = require('../places');
const Shop = require('../models/Shops');
const Rating = require('../models/Rating')

// Local storing of shops to display e.g start with 5 
let max = 5;
let shops = [];

// List of shops from a postcode
router.post('/results', ensureAuthenticated, (req, res) => {
    let { postCode } = req.body;
    postCode = postCode.toFormattedPostCode();
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
                        const imageURL = newShopFromCall.imageURL;
                        const lat = newShopFromCall.lat;
                        const lng = newShopFromCall.lng;
                        const postcodes = newShopFromCall.postcodes;
                        const newShopToDB = new Shop({
                            id,
                            name,
                            address,
                            imageURL,
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

// Load more (increasing local variable max)
router.post('/', ensureAuthenticated, (req, res) => {
    increaseLimit();
    const shopsToReturn = getLocalShops(max);
    res.render('shops', {shops: shopsToReturn});
});

// Displaying an individual shop
router.get('/:id', ensureAuthenticated, async (req,res) => {
    try {

    const id = req.params.id;
        const shopInfo = await Shop.findOne({id : id});
        const coffeeRatings = await Rating.find({coffee_id : id });
        const formattedName = shopInfo.name.replace("&","and");
        let overallRating = 0;
        let atmosphereRating = 0;
        let qualityRating = 0;
        let dairyFreeRating = 0;
        const numRatings = coffeeRatings.length;

        if (numRatings > 0 ){
            coffeeRatings.forEach(coffeeRating => {
                overallRating += coffeeRating.overall;
                atmosphereRating += coffeeRating.atmosphere;
                qualityRating += coffeeRating.coffee_quality;
                dairyFreeRating += coffeeRating.dairy_free;
            });

            overallRating = (overallRating/coffeeRatings.length).toLocaleString("en-UK", {maximumFractionDigits: 2, minimumFractionDigits: 0});
            atmosphereRating = (atmosphereRating/coffeeRatings.length).toLocaleString("en-UK", {maximumFractionDigits: 2, minimumFractionDigits: 0});
            qualityRating = (qualityRating/coffeeRatings.length).toLocaleString("en-UK", {maximumFractionDigits: 2, minimumFractionDigits: 0});
            dairyFreeRating = (dairyFreeRating/coffeeRatings.length).toLocaleString("en-UK", {maximumFractionDigits: 2, minimumFractionDigits: 0});
        }


        return res.render('shopInfo', 
        {
            shopInfo, 
            formattedName, 
            overallRating, 
            atmosphereRating,
            qualityRating,
            dairyFreeRating,
            numRatings
        });
    
    } catch (err) {
        console.error(err);
        return res.render('error/500');
    }
});

// Rating a shop
router.get('/:id/rate', ensureAuthenticated, async (req, res) => {
    const placeID = req.params.id;
    const shopInfo = await Shop.findOne({id : placeID});

    res.render('ratings/add', {name : req.user.name, placeID, shopInfo});
});

// Call to GoogleAPI
function setLocalShops(postcode) {
    shops = googleAPIs.getCoffeeShops(postcode);
}

// Get a sub-array of local variable shops
function getLocalShops(numShops) {
    return shops.slice(1,numShops);
}

// Increase num of shops to display
function increaseLimit() {
    if (max <= shops.length){
        max += 5;
    }
}

// Formatting postocdes to all be the same
String.prototype.toFormattedPostCode = function(){
    return this.toUpperCase().replace(' ', '');
}

module.exports = router;