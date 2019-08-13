const express = require('express');
const router = express.Router();


// @route         GET api/post
// @description   Test Route
// @access        Puplic

router.get('/', (req,res,next)=> res.send('Post route'));

module.exports = router;