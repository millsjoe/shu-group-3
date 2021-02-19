const User = require("../models/User");

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view this page');
        res.redirect('/login');
    },
    isAdmin: function(req, res, next) {
        if (req.isAuthenticated() && (req.user.admin == true)) {
            return next();
        }
        req.flash('error_msg', 'Only admin can see this page');
        res.redirect('/login');
    }
}