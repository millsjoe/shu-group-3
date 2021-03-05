const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require('../config/auth');
const Rating = require('../models/Rating');
const User = require("../models/User");

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
        const allRatings = await Rating.find();
        const allUsers = await User.find()
        
        res.render('admin', {
            name: req.user.name,
            allRatings, allUsers,
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

module.exports = router;
