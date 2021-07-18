const express = require('express')

const router = new express.Router()

const { userAuth } = require('../middleware')

const { postController } = require('../controllers')

const { getPostById, createPost , updatePost , deletePost , postImageError ,
         likePost , postLikedPersons , giveComment , giveReplyComment , likeComment , getAllComments , 
         likeReply , editComment , editReply , deleteComment , deleteReply
       } = postController

const { upload } = require('../utils')

//GET requests

// home page ->
      // all posts ->sorted() ->pagination(20 posts -> 20posts -> 20posts)({ desc : -1 })
      // latest post first seen hona parega

// followers ->
    // all post-> filtering 

// trending ->
   // all post -> sort by maxm likes 

//get post by id
router.get('/:_id', getPostById)

// *************

// POST requests
// create post
router.post('/', userAuth , upload.array('images',10) ,  createPost , postImageError)

// *************

// PATCH request
// update post
router.patch('/:_id', userAuth , upload.array('images',10)  ,  updatePost , postImageError )

// like a post
router.patch('/like/:_id', userAuth, likePost)

//get all person liked
router.get('/likes/:_id', userAuth, postLikedPersons)

//get all comments
router.get('/comment/:_id', getAllComments)

// post a comment
router.post('/comment/:_id',userAuth, giveComment)

// reply a comment
router.patch('/comment/reply/:comment_id', userAuth, giveReplyComment)

// like a base comment
router.patch('/comment/like/:comment_id', userAuth, likeComment)

// like a reply
router.patch('/comment/reply_like/:comment_id', userAuth, likeReply)

// edit a comment
router.patch('/comment/edit_comment/:comment_id', userAuth, editComment)

//edit a reply
router.patch('/comment/edit_reply/:comment_id', userAuth, editReply)

// delete a comment
router.delete('/comment/delete_comment/:comment_id', userAuth, deleteComment)

// delete a reply
router.delete('/comment/delete_reply/:comment_id', userAuth, deleteReply)

// for all above update functions .... the main post owner will get a notification

// we will use websockets for the notifications + posts for automatic updates

//************* *

// Delete a post
// delete post
router.delete('/:_id',userAuth , deletePost)

module.exports = router


//dropdown -> all / followers / trending