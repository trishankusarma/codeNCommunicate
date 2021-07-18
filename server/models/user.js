const mongoose = require('mongoose')

const { Schema , model } = mongoose

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const validator = require('email-validator')

const userSchema = Schema({
    name: {
        type: String,
        required: true,
        trim: true
      },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
      },
    isActive:{
       type:Boolean,
       default:false
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    about: {
       type:String, 
       trim:true
    },
    role:{
      type:String
    },
    institute:{
      type:String
    },
    company:{
      type:String
    },
    cf_handle:{  
      type:String 
    },
    cc_handle:{
      type:String
    },
    ln_link:{
      type:String
    },
    followers:[{

      follower:{
        
        type:mongoose.Schema.Types.ObjectId
      }
    }],
    profileImage:{
      type:Buffer
    },
    profileImageType:{
      type:String
    },
    noOfFollowers:{
      type:Number,
      default:0
    },
    notifications:[{

        notification:{
          type:String
        },
        readStatus:{
          type:Boolean,
          default:false
        }
    }]
})

userSchema.virtual('doubts', {

  ref: 'Doubt',

  localField: '_id',

  foreignField: 'owner'
})

userSchema.virtual('posts', {

  ref: 'Post',

  localField: '_id',

  foreignField: 'owner'
})

userSchema.methods.generateActivationToken = async function(next){
   
  const { name , email , password } = this

  const token = await jwt.sign(
     {
      _id: this._id.toString(),
      name,
      email,
      password
     },
 
     process.env.ACTIVATION_TOKEN_SECRET,
    {
      expiresIn: '5m',
    }
  )
  
  return token
}

userSchema.methods.generateAccessToken = async function(next){
   
  const user = this

  const token = await jwt.sign(
     {
      _id: user._id.toString(),
     },

     process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '5m',
    }
  )
  
  return token
}

userSchema.methods.generateAuthToken = async function(next){
   
     const user = this

     const token = await jwt.sign(
        { _id: user._id.toString() },
    
        process.env.REFRESH_TOKEN_SECRET,
       {
         expiresIn: '7d',
       }
     )
     
     return token
}

userSchema.statics.findByCredentials = async (email_or_name,password)=>{

    let user

    if(validator.validate(email_or_name)){  

        user = await User.findOne({email: email_or_name})
    }else{
        user = await User.findOne({name : email_or_name})
    }

    if(!user){
       return null
    }

    const isMatch = await bcrypt.compare( password , user.password )

    if(!isMatch){
      return null
    }

    return user
}

userSchema.pre('save',async function(next){

    const user = this
 
    if(user.isModified('password')){
         user.password = await bcrypt.hash(user.password,10)
    }
   
    next()
})

module.exports = User = model('User' , userSchema)