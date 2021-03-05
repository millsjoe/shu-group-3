const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User model
const User = require('../models/User');

//Profile Page
router.get('/profile', (req, res) => res.render('Profile'));

//Login Page
router.get('/login', (req, res) => res.render('Login'));

//Register
router.get('/register', (req, res) => res.render('Register'));

//Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields'});
    }

    //Check password is secure
    var securePassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (!password.match(securePassword)) {
        errors.push({msg: 'Password is not secure enough. Your password must be 8-15 characters long containing at least one lowercase letter, one upercase letter, one numeric digit and one special character.' });
    }

    //Check passwords match
    if (password !== password2) {
        errors.push({msg: 'Passwords do not match'});
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
    } else {
        //Validation passed
        User.findOne({ email: email}).then(user => {
            if(user) {
                // User exists
                errors.push({msg: 'Email is already registered '});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                
                //Hash Password with bcrypt
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        //Set password to hashed password
                        newUser.password = hash;
                        //Save user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in');
                                res.redirect('/login');
                            })
                            .catch(err => console.log(err));
                }))
            }
        });
    }
});

// Local track of login attempts 
let loginAttempt = 0;
let reinstateTime;
//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', function(err, user, info){
        const { name, email } = req.body;
        if (err) { return next(err); }
        
        loginAttempt++; 
        if (loginAttempt > 5) {
            enforceCoolDown();
        }
        if (!inCoolDown()) {
            if (!user) { 
                req.flash('error_msg', `Login attempt ${loginAttempt}/5 failed`);
                return res.redirect('/login');
            }
            req.logIn(user,function(err) {
                loginAttempt = 0;
                if (err) { return next(err); }
                req.flash('success_msg', 'Succesfully logged in');
                if (email === 'admin@admin.com') {
                    return res.redirect('/admin');
                } else {
                    return res.redirect('/home');
                }
            });
        } else {
            req.flash('error_msg', `Too many attempts please allow a cooldown (${(reinstateTime - Date.now())/1000}s)`);
            return res.redirect('/login');
        } 
    })(req, res, next);
});
  //Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});  

function inCoolDown() {

    if (Date.now() < reinstateTime) {
        return true;
    } else {
        return false;
    }

}
function enforceCoolDown() {
    reinstateTime = Date.now() + 30000 //30 seconds;
    loginAttempt = 0;
}
module.exports = router;