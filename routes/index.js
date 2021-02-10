const express = require("express");
const router = express.Router();
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

module.exports = router;