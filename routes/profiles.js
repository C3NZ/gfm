const express = require('express');
const router = express.Router();
const passport = require('passport')

const User = require('../models/user');

router.get('/', function(req, res) {
        User.findbyId(req.session.Session.passport.user).then(user => {
            console.log(req.session.Session)
            console.log(user)
            res.render('profile', {user: user})
        })
    }
)

module.exports = router;
