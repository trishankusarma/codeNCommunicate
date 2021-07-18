const express = require('express')
const router = new express.Router()

const userRouter = require('./user')
const postRouter = require('./post')
const homeRouter = require('./home')

router.use('',homeRouter)

router.use('/user',userRouter)

router.use('/post',postRouter)

module.exports = router