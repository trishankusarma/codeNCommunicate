const express = require('express')
const router = new express.Router()

const { userController } = require('../controllers')
const { userAuth } = require('../middleware')

const { login, register, getProfile, getFollowing , updateProfile, activateAcount, forgetPassword, updatePassword, logout, profileImageError, followOthers, unFollowOthers , checkIfAuthenticated } = userController

const { upload } = require('../utils')

//get User Profile
router.get('/', userAuth, getProfile)

router.get('/isAuthenticated', userAuth , checkIfAuthenticated )

//*****GET******** */

// User Basic Profile
// without posts

// User Detailed Profile
// with posts

// User Public Profile
// with posts -> with no edit in user profile    

// get my followings
router.get('/getFollowing', userAuth, getFollowing)

// follow someone
router.patch('/follow/:follower', userAuth, followOthers)

// unfollow someone
router.patch('/unfollow/:follower', userAuth, unFollowOthers)

//********POST************ */

//Create User -> register
router.post('/register', register)

//Login User
router.post('/login', login)

//Email Confirmation
router.patch('/activate/:activationToken', activateAcount)

//Forget Password
router.post('/forgetPassword', forgetPassword)

//update Password
router.patch('/updatePassword/:access_token', updatePassword)

//*********PATCH************* */ 

//Update Profile with profile Image
router.patch('/update',
    userAuth,
    upload.single('profileImage'),
    updateProfile,
    profileImageError
)

// 2. add followers  + increase no of followers of the other user 

//logout 
router.get('/logout', userAuth, logout)

//********DELETE ACCOUNT************* */

module.exports = router

// password -> 

// 1 -> atleast one character 
// 2 -> atleast one numeric value
// 4 -> minimum length-6

// name , email  , password aur confirm password

// send message 