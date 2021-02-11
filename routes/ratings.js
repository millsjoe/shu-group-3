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

// Show edit page
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  const ratings = await Rating.findOne({
    _id: req.params.id
  })

  if (!ratings) {
    return console.error(err)
  }

  if (ratings.user != req.user.id) {
    res.redirect ('/home')
  } else{
    res.render('ratings/edit', {
      ratings,
    })
  }
})

// Update rating
router.put ('/:id', ensureAuthenticated, async (req, res) => {
  let rating = await Rating.findById(req.params.id)

  if (!rating) {
    return console.log(err)
  }

  if (rating.user != req.user.id) {
    res.redirect('/profile')
  } else {
    rating = await Rating.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    })

    res.redirect('/home')
  }
})

module.exports = router;