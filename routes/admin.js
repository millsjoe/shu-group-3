const express = require("express");
const router = express.Router();
const { isAdmin } = require('../config/auth');

const Rating = require('../models/Rating');
const User = require("../models/User");

//Admin Delete rating
router.delete('/rating/:id', isAdmin, async (req, res) => {
    try {
      await Rating.remove({_id: req.params.id })
      req.flash('success_msg', 'Rating deleted');
      res.redirect('/admin')
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })

  // Show edit rating page for admin
router.get('/editRating/:id', isAdmin, async (req, res) => {
  try {
    const allRatings = await Rating.findOne({
      _id: req.params.id
    })
      res.render('admin/editRating', {
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

//Show edit user page for Admin
router.get('/viewUser/:id', isAdmin, async (req, res) => {
  try {
    const userInfo = await User.findOne({
      _id: req.params.id
    })
    const userRatings = await Rating.find({user: req.params.id})

      res.render('admin/viewUser', {
        userInfo, userRatings,
      })

  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

//Delete user (doesn't actually work)
router.delete('/user/:id', isAdmin, async (req, res) => {
  try {
    await User.remove({_id: req.params.id })
    req.flash('success_msg', 'User deleted');
    res.redirect('/admin')
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

  module.exports = router;