const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult} = require('express-validator');

const Profile = require('../../models/Profile');
const User = require ('../../models/User');


// @route         GET api/Profile/me
// @description   Get current user's profile
// @access        Private

router.get('/me', auth, async (req,res,next)=> {
  try {
    const profile =  await Profile.findOne({user: req.user.id}).populate('user', ["name", 'avatar']);

    if(!profile) {
      return res.status(400).json({msg: "Profile not found"})
    }

    res.json(profile)

  }catch(err){
    console.error(err.message);
    res.status(500).send("Server Error")
  }
});

// @route         POST api/Profile/me
// @description   Create/update user's profile
// @access        Private
router.post('/', [
  auth,
  [
    check('status', "status is required").not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
  ]
], 
async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()})
  }

  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;

  // Build profile object

  const profileFields = {};
  profileFields.user = req.user.id;
  if(company) profileFields.company = company;
  if(website) profileFields.website = website;
  if(location) profileFields.location = location;
  if(bio) profileFields.bio = bio;
  if(status) profileFields.status = status;
  if(githubusername) profileFields.githubusername = githubusername;
  if(skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim());
  }

  // Build Social object
  profileFields.social = {}
  if(youtube) profileFields.social.youtube = youtube;
  if(twitter) profileFields.social.twitter = twitter;
  if(facebook) profileFields.social.facebook = facebook;
  if(linkedin) profileFields.social.linkedin = linkedin;
  if(instagram) profileFields.social.instagram = instagram;

  try{
    let profile = await Profile.findOne({ user: req.user.id});

    if(profile){
      profile = await Profile.findOneAndUpdate({ user: req.user.id }, {$set: profileFields}, {new: true});

      return res.json(profile)
    }

    //Creat
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);


  }catch(err){
    console.error(err.message);
    res.status(500).sent("server error")
  }
});

// @route         GET api/Profile
// @description   Get all profiles
// @access        Public

router.get('/', async (req, res, next)=> {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles)
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error")
  }
});

// @route         GET api/profile/user/:user_id
// @description   Get profile by user ID
// @access        Public

router.get('/user/:user_id', async (req, res, next)=> {
  try {
    const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);

    if(!profile) return res.status(400).json({ msg: "Profile not found"})

    res.json(profile)
  } catch (err) {
    console.error(err.message);
    if(err.kind = "ObjectId") {
      res.status(400).json({ msg: "Profile not found"})
    }
    res.status(500).send("server error")
  }
});

module.exports = router;