const express = require('express');
const router = express.Router();
const {check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');


// @route         POST api/post
// @description   Create a post
// @access        Private

router.post('/', [ auth,
  [
    check('text', "Text is required").not().isEmpty()
  ]
],
async (req,res,next)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty){
    return res.status(400).json({ errors: errors.array() })
  }

  try {
      const user = await User.findById(req.user.id).select('-password');

  const newPost = new Post({
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id
  })

  const post = await newPost.save();

  res.json(post);

  } catch (err) {
    console.error(err.message)
    res.status(500).send("server error!")
  }
});

// @route         GET api/post
// @description   Get all posts
// @access        Private

router.get('/', auth, async (req,res, next) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message)
    res.status(500).send("server error!")
  }
});

// @route         GET api/posts/:id
// @description   Get post by id
// @access        Private

router.get('/:id', auth, async (req,res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if(!post){
      return res.status(404).json( { msg: "Post not found" } );
    }
    res.json(post);
  } catch (err) {
    console.error(err.message)
        if(err.kind==="ObjectId"){
      return res.status(404).json( { msg: "Post not found" } );
    }
    res.status(500).send("server error!")
  }
});

// @route         DELETE api/posts/:id
// @description   Delete post by id
// @access        Private

router.delete('/:id', auth, async (req,res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if(!post){
      return res.status(404).json( { msg: "Post not found" } );
    }

    // Check on user
    if(post.user.toString() !== req.user.id) {
      return res.status(401).json({msg: "user not authorized"})
    }

    await post.remove()

    res.json({msg: "Post removed"});
  } catch (err) {
    console.error(err.message)
        if(err.kind==="ObjectId"){
      return res.status(404).json( { msg: "Post not found" } );
    }
    res.status(500).send("server error!")
  }
});

// @route         PUT api/posts/like/:id
// @description   Like a post
// @access        Private

router.put('/like/:id', auth, async (req, res, next)=> {
  try {
    const post = await Post.findById(req.params.id);

    if(!post){
      return res.status(404).json( { msg: "Post not found" } );
    }

    // Check if post has already been liked
    if(post.likes.filter(like=> like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: "Post already liked" })
    }


    post.likes.unshift({user: req.user.id})

    await post.save();

    return res.json(post.likes)

  } catch (err) {
    console.error(err.message)
    res.status(500).send("server error!")
  }
});

// @route         PUT api/post/unlike/:id
// @description   Unlike a post
// @access        Private

router.put('/unlike/:id', auth, async (req, res, next)=> {
  try {
    const post = await Post.findById(req.params.id);

    if(!post){
      return res.status(404).json( { msg: "Post not found" } );
    }

    // Check if post has already been liked
    if(post.likes.filter(like=> like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: "Post hasn't been liked" })
    }


    // Get remove index
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

    post.likes.splice(removeIndex, 1)

    await post.save();

    return res.json(post.likes)

  } catch (err) {
    console.error(err.message)
    res.status(500).send("server error!")
  }
});

// @route         POST api/post/comment/:id
// @description   Comment on a post
// @access        Private

router.post('/comment/:id', [ auth,
  [
    check('text', "Text is required").not().isEmpty()
  ]
],
async (req,res,next)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty){
    return res.status(400).json({ errors: errors.array() })
  }

  try {
      const user = await User.findById(req.user.id).select('-password');

  const post = await Post.findById(req.params.id);

  const newComment ={
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id
  }

  post.comments.unshift(newComment)

  await post.save();

  res.json(post.comments);

  } catch (err) {
    console.error(err.message)
    res.status(500).send("server error!")
  }
});

// @route         DELETE api/post/comment/:id/:comment_id
// @description   Delete comment
// @access        Private

router.delete('/comment/:id/:comment_id', auth, async (req,res,next)=>{
  try {
    const post = await Post.findById(req.params.id);

    //Pull out comment 
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);

    //Make sure comment exists
    if(!comment){
      return res.status(404).json({msg: "Comment does not exist"})
    }

    //Check user
    if(comment.user.toString() !== req.user.id){
      return res.status(401).json({msg: "User not authorized to delete"})
    }

    // Get remove index
    const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)

    post.comments.splice(removeIndex, 1)

    await post.save();

    return res.json(post.comments)

  } catch (err) {
    console.error(err.message)
    res.status(500).send("server error!")
  }
  
});

module.exports = router;