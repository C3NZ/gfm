const express = require('express');
const router = express.Router();
const passport = require('passport')

const User = require('../models/user');

router.get('/', passport.authenticate('github'))

router.get('/callback', passport.authenticate('github', {failureRedirect: '/', successRedirect: '/teams'}));

module.exports = router;
