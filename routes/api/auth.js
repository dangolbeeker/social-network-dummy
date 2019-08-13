const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth')
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config')

const User = require('../../models/User')

// @route         GET api/Auth
// @description   Test Route
// @access        Public

router.get('/', auth, async (req,res,next)=> {
  try{  
    const user = await User.findById(req.user.id).select('-password')
    res.json(user);
  }catch(err){
    console.error(err.message);
    res.status(500).send('Server Error!')
  }
});

// @route         POST api/auth
// @description   Authenticate User and Get Token
// @access        Public

router.post('/', 
  [
    check("email", 'You need an email').isEmail(),
    check('password', "Password is needed").exists()
  ], 
  async (req,res,next)=> {
    console.log(req.body)

    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
    }

    const {email, password} = req.body;

    try{
    let user = await User.findOne({email});

    if(!user){
      return res.status(400).json({errors: [{msg: "Invalid credentials"}]})
    }


    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
      return res.status(400).json({errors: [{msg: "Invalid credentials"}]})
    }

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload, 
      config.get('jwtSecret'),
      {expiresIn: 360000},
      (err, token) => {
        if(err) throw err;
        res.json({token})
      }
    )

    }catch(err){
      console.error(err.message);
      res.status(500).send('Server error')
    }

  }
);

module.exports = router;