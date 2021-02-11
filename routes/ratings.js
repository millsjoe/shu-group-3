const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const Rating = require('../models/Rating')

//View ratings page
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ratings/add')
  })
  
//Add ratings
router.post('/', ensureAuthenticated, async (req, res) => {
    try {
      req.body.user = req.user.id
      await Rating.create(req.body)
      res.redirect('/profile')
    } catch (err) {
      console.error(err)
    }
  })
module.exports = router;