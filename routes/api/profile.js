const express = require('express');
const router = express.Router();


// @route         GET api/Profile
// @description   Test Route
// @access        Puplic

router.get('/', (req,res,next)=> res.send('Profile route'));

module.exports = router;