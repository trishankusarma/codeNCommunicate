const { User } = require("../models")
const { sendEmail, cookieConfig } = require("../utils")

const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const validator = require("email-validator")

const internalServerError = {
    success: 0,
    msg: "Internal Server Error! Please Try Again",
    user: null,
}

const sendEmailFunc = async (email, user) => {
  const activation_token = await user.generateActivationToken();

  const url = `${process.env.CLIENT_URL}/user/activate/${activation_token}`;

  await sendEmail(email, url, "Verify your email address");
};

const userController = {
  login: async (req, res) => {
    try {
      const { email_or_name, password } = req.body;

      const user = await User.findByCredentials(email_or_name, password);

      if (!user) {
        return res.json({
          success: 0,
          msg: "Invalid Credentials",
          user: null,
        });
      }

      if (user.isActive === false) {
        if (validator.validate(email_or_name)) {
          sendEmailFunc(email_or_name, user);

          return res.json({
            success: 0,
            msg: "Email Inactive,Activatation link has been sent!",
            user: null,
          });
        } else {
          return res.json({
            success: 0,
            msg: "Email Inactive,Try Login With Email to get activation link!",
            user: null,
          });
        }
      }

      await user.populate('posts').execPopulate()

      const token = await user.generateAuthToken();

      res.cookie("authorization", token, cookieConfig);

      res.json({
        success: 1,
        msg: "Login Successful",
        user
      });
    } catch (error) {
      res.json(internalServerError)
    }
  },

  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existUser = await User.findOne({ email });

      if (existUser) {

        if(existUser.isActive === false){
          return res.json({
            success: 0,
            msg: "User Email Inactivated mail has already been sent",
          });
        }

        return res.json({
          success: 0,
          msg: "User Already Exists with that Email",
        });
      }

      const user = await User({
        name,
        email,
        password,
      });

      await user.save();

      sendEmailFunc(email, user);

      res.json({
        success: 1,
        user,
        msg: "An Email has been sent to your registered email.",
      });
    } catch (error) {
      res.json(internalServerError);
    }
  },

  activateAcount: async (req, res) => {
    try {
      const { activationToken } = req.params;

      jwt.verify(
        activationToken,
        process.env.ACTIVATION_TOKEN_SECRET,
        async (err, user) => {
          if (err) {
            return res.json({
              success: 0,
              msg: "Invalid Link!",
              user: null,
            });
          }

          const inActiveUser = await User.findOne({ email: user.email });

          if (!inActiveUser) {
            return res.json({
              success: 0,
              msg: "Invalid Link!",
              user: null,
            });
          } else if (inActiveUser && inActiveUser.isActive) {
            return res.json({
              success: 0,
              msg: "Account already activated!",
              user: null,
            });
          }

          inActiveUser.isActive = true;

          await inActiveUser.save();

          const token = await inActiveUser.generateAuthToken();

          res.cookie("authorization", token, cookieConfig);

          res.json({
            success: 1,
            msg: "Account has been activated",
            user: inActiveUser,
          });
        }
      );
    } catch (error) {
      res.json(internalServerError);
    }
  },

  forgetPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const existUser = await User.findOne({ email });

      if (!existUser) {
        return res.json({
          success: 0,
          msg: "No user with this email exists",
          user: null,
        });
      }

      if (existUser.isActive === false) {
        sendEmailFunc(email, existUser);

        return res.json({
          success: 0,
          msg: "Email inactive,Activation link has been mailed! Please activate to proceed furthur!",
          user: null,
        });
      }

      const access_token = await existUser.generateAccessToken();

      const url = `${process.env.CLIENT_URL}/user/updatePassword/${access_token}`;

      sendEmail(email, url, "Change your Password");

      res.json({
        success: 1,
        msg: "An Email has been sent to your registered email.Click to change Password",
        user: null,
      });
    } catch (error) {
      res.json({
        success: 0,
        msg: "Internal Server Error! Please enter your email again!",
        user: null,
      });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const access_token = req.params.access_token;

      const { newPassword } = req.body;

      jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, user) => {
          if (err) {
            return res.json({
              success: 0,
              msg: "Invalid Token",
              user: null,
            });
          }

          const userU = await User.findById(user._id);

          const isSame = await bcrypt.compare(newPassword, userU.password);

          if (isSame) {
            return res.json({
              success: 0,
              msg: "Please Set New Password",
              user: null,
            });
          }

          userU.password = newPassword;

          await userU.save();

          const token = await userU.generateAuthToken();

          res.cookie("authorization", token, cookieConfig);

          res.json({
            success: 1,
            msg: "Password Updated",
            user: userU,
          });
        }
      );
    } catch (error) {
      res.json({
        success: 0,
        msg: "Internal Server Error! Please try again!",
        user: null,
      });
    }
  },
  
  checkIfAuthenticated: (req,res)=>{
      try {
        
        const user = req.user

        if(!user){
            res.json({
              success:0,
              msg:'Not Authenticated',
            })
        }

        res.json({
          success:1,
          msg:'Authenticated',
          user
        })

      } catch (error) {
        res.json(internalServerError)
      } 
  },

  getProfile: async (req, res) => {
    try {

      const { 
          profile_id
      }  = req.query

      let user

      if(profile_id){
         
        user = await User.findById(profile_id,{
             followers:0,
             password:0
        })

      }else{
        
         user = req.user
      }

      await user
        .populate('posts')
        .populate('comments','content author likes')
        .execPopulate()

      res.json({
        success: 1,
        msg: "User",
        user,
        posts:user.posts
      });
    } catch (error) {
      res.json({
        success: 0,
        msg: "Internal Server Error! Please try Again",
        user: null,
      });
    }
  },

  getFollowing: async (req, res) => {
    try {

      const user = req.user

      await 
          user .populate({
            path: 'followers',
            populate: {
              path: 'follower',
              select:'name cf_handle cc_handle ln_link profileImage profileImageType noOfFollowers'
            }
          }).execPopulate()

      res.json({
        success: 1,
        user
      });
    } catch (error) {
      res.json({
        success: 0,
        msg: "Internal Server Error! Please try Again",
        user: null,
      });
    }
  },

  followOthers: async (req, res) => {
    try {
      const user = req.user

      const followerId = req.params.follower

      const exist = user["followers"].find(follower=>{
           return follower.follower==followerId
      })

      if(exist){
          return res.json({
              success:0,
              msg:'User Already followed'
          })
      }

      user["followers"] = user["followers"].concat({
        'follower': followerId
      })

      const follower = await User.findById(followerId,{
        noOfFollowers:true
      })

      follower.noOfFollowers = follower.noOfFollowers + 1

      await user.save()
      await follower.save()

      res.json({
        success: 1,
        msg: "User Followed"
      })
    } catch (error) {

       res.json(internalServerError)
    }
  },

  unFollowOthers: async (req, res) => {
    try {
      const user = req.user

      const followerId = req.params.follower

      const exist = user["followers"].find((follower)=>follower.follower==followerId)

      if(!exist){
        return res.json({
            success:0,
            msg:"user not followed"
        })
      }

      user["followers"] = user["followers"].filter((follower)=>follower.follower!=followerId)

      const follower = await User.findById( followerId ,{
            noOfFollowers:true
      })
    
      follower.noOfFollowers = follower.noOfFollowers - 1

      await user.save()
      await follower.save()

      res.json({
        success: 1,
        msg: "User Unfollowed"
      })
    } catch (error) {

       res.json(internalServerError)
    }
  },

  updateProfile: async (req, res) => {
    //  allowed_updates : "about" , "role" , "institute", "company" , "cf_handle", "cc_handle" , "ln_link"
    // profileImage profileImageType
    console.log(req.body)
    try {
      const updates = Object.keys(req.body);
      const user = req.user;

      updates.forEach((update) => (update!=='profileImage' ? user[update] = req.body[update] : null));

      if(req.file){

        console.log("req.file",req.file)

        user["profileImage"] = req.file.buffer;
        user["profileImageType"] = req.file.mimetype;
      }

      await user.save();

      console.log("USER",user)

      res.json({
        success: 1,
        msg: "User Updated",
        user,
      });
    } catch (error) {
      console.log(error)
      res.json(internalServerError);
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("authorization");

      res.json({
        success: 1,
        msg: "Successfull Logged Out",
        user: null,
      });
    } catch (error) {
      res.json(internalServerError);
    }
  },

  profileImageError: (error, req, res, next) => {
    res.status(400).json({
      success: 0,
      msg: "Please provide an image less than 1MB",
      user: null,
    });
  }
};

module.exports = userController;
