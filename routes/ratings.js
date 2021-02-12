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
      req.flash('success_msg', 'Rating added');
      res.redirect('/profile')
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })

// Show edit page
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    const ratings = await Rating.findOne({
      _id: req.params.id
    })
  
    if (!ratings) {
      return res.render('error/404')
    }
  
    if (ratings.user != req.user.id) {
      res.redirect ('/home')
    } else{
      res.render('ratings/edit', {
        ratings,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// Update rating
router.put ('/:id', ensureAuthenticated, async (req, res) => {
  try {
  let rating = await Rating.findById(req.params.id)

  if (!rating) {
    return res.render('error/404')
  }

  if (rating.user != req.user.id) {
    res.redirect('/profile')
  } else {
    rating = await Rating.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    })
    req.flash('success_msg', 'Rating updated');
    res.redirect('/profile')
  }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

//Delete rating
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Rating.remove({_id: req.params.id })
    req.flash('success_msg', 'Rating deleted');
    res.redirect('/profile')
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// CODE FOR LOOKING UP RATINGS AGAINST COFFEE SHOPS
// router.get('/', ensureAuth, async (req, res) => {
//   try {
//     const ratings = await Rating.find({ status: 'public' -- CHANGE CODE })
//       .populate('user')
//       .sort({ createdAt: 'desc' })

//     res.render('shops/index', {
//       ratings,
//     })
//   } catch (err) {
//     console.error(err)
//     res.render('error/500')
//   }
// })

module.exports = router;