const express = require("express");
const router = express.Router();
const { isAdmin } = require('../config/auth');

const Rating = require('../models/Rating')

//Get all ratings for admin
router.get('/admin', isAdmin, async (req, res) => {
    try {
      const allRatings = await Rating.find()
    
      if (!allRatings) {
        req.flash('error_msg', 'There are no ratings')
      }

    res.render('admin', {
        allRatings,
    })

    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })

//Admin Delete rating
router.delete('/:id', isAdmin, async (req, res) => {
    try {
      await Rating.remove({_id: req.params.id })
      req.flash('success_msg', 'Rating deleted');
      res.redirect('/admin')
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })

  // Show edit page for admin
router.get('/edit/:id', isAdmin, async (req, res) => {
  try {
    const allRatings = await Rating.findOne({
      _id: req.params.id
    })
      res.render('admin/edit', {
        allRatings,
      })

  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// Admin update rating
router.put ('/:id', isAdmin, async (req, res) => {
  try {
  let rating = await Rating.findById(req.params.id)

  if (!rating) {
    return res.render('error/404')
  }

    rating = await Rating.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    })
    req.flash('success_msg', 'Rating updated');
    res.redirect('/admin')

  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})
  module.exports = router;