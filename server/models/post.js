const mongoose = require('mongoose')

const { Schema , model } = mongoose

const postSchema = Schema({

    title:{
        type:String
    },
    
    description:{  
        type:String
    },

    postType:{
        
       type:Number,
       default:0
    },

    images:[{
        image:{
            type:Buffer
        },
        imageType:{
            type:String
        }
    }],

    likes:{
        type:Number,
        default:0
    },

    no_of_comments:{
        type:Number,
        default:0
    },

    likedPersons:[{
        liker:{
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    }],

   created_at:{
      type: String
   },
   
   owner:{
     
      type:Schema.Types.ObjectId,
      required:true,
      ref:'User'
   }
})

postSchema.virtual('comments',{
    ref: 'Comment',

    localField: '_id',
  
    foreignField: 'post'
})

module.exports = Post = model('Post',postSchema)