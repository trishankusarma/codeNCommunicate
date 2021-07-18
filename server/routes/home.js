const express = require('express')
const router = new express.Router()

const { postController } = require('../controllers') 
const { getAllPost } = postController

router.get('/',getAllPost)

module.exports = router