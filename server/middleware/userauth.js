const jwt = require('jsonwebtoken')
const { User } = require('../models')


const userAuth = (req, res, next) => {

    try {
        const token = req.cookies.authorization
    
        if(!token) 
              return res.status(400).json({msg: "Invalid Authentication."})

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
             
            if(err) 
              return res.json({
                  success:0,
                  msg: "Invalid Authentication.",
                  user:null
              })

            req.user = await User.findById(user._id)

            next()
        })
    } catch (err) {
        return res.json({
            success:0,
            msg: "Internal server error.",
            user:null
        })

    }
}

module.exports = userAuth