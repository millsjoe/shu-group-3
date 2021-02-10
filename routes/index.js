const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//Welcome page (not logged in)
router.get('/', (req, res) => res.render('index'));

//Homepage (logged in)
router.get('/home', ensureAuthenticated, (req, res) => 
    res.render('home', {
        name: req.user.name
    }));

module.exports = router;