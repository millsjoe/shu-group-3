const express = require("express");
const router = express.Router();
const googleAPIs = require('../places');
const bodyParser = require("body-parser");
const Shop = require('../models/Shops');
const { ensureAuthenticated, isAdmin } = require('../config/auth');
const Rating = require('../models/Rating')

let max = 5;
let shops = [];

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
        res.render('error/500')
    }  
});

//Admin page
router.get('/admin', isAdmin, async (req, res) => {
    try {
        const allRatings = await Rating.find()
        
        res.render('admin', {
            name: req.user.name,
            allRatings
        })
    }   catch (err) {
        console.error(err)
        res.render('error/500')
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
        res.render('error/500')
    }  
});


router.post('/shop-results', (req, res) => {
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

router.post('/shops', (req, res) => {
    increaseLimit();
    const shopsToReturn = getLocalShops(max);
    res.render('shops', {shops: shopsToReturn});
});

router.get('/shops/:id', async (req,res) => {

    try {

    const id = req.params.id;
        const shopInfo = await Shop.findOne({id : id});
        const coffeeRatings = await Rating.find({coffee_shop : id });
        
        const formattedName = shopInfo.name.replace("&","and");
        let overallRating = 0;
        let atmosphereRating = 0;
        let qualityRating = 0;
        let dairyFreeRating = 0;
    

        coffeeRatings.forEach(coffeeRating => {
            overallRating += coffeeRating.overall;
            atmosphereRating += coffeeRating.atmosphere;
            qualityRating += coffeeRating.coffee_quality;
            dairyFreeRating += coffeeRating.dairy_free;
        });

        overallRating = overallRating/coffeeRatings.length;
        atmosphereRating = atmosphereRating/coffeeRatings.length;
        qualityRating = qualityRating/coffeeRatings.length;
        dairyFreeRating = dairyFreeRating/coffeeRatings.length;

        return res.render('shopInfo', 
        {
            shopInfo, 
            formattedName, 
            overallRating, 
            atmosphereRating,
            qualityRating,
            dairyFreeRating
        });
    
    } catch (err) {
        console.error(err);
        return res.render('error/500');
    }
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

function formatPostcode(postcode) { 
    console.log(postcode.postCode.toUpperCase().trim());
    return postcode.postCode.toUpperCase();
}

String.prototype.toFormattedPostCode = function(){
    return this.toUpperCase().replace(' ', '');
}

module.exports = router;
