const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log(req.session)
    res.render('teams')
    //res.status(200).send('You have done it!')
})

module.exports = router;
