const mongoose = require('mongoose')

const { Schema , model } = mongoose

const commentSchema = Schema({
    content: { 
        type: String ,
        required:true
    },
    author : { 
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    likes:{
        type:Number,
        default:0
    },
    post:{
        type:Schema.Types.ObjectId,
        ref:'Post'
    },
    likedPersons:[{
        liker:{
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    }],
    replies:[{
        content: { 
            type: String ,
            required:true
        },
        author : { 
            type: Schema.Types.ObjectId, 
            ref: 'User'
        },
        likes:{
            type:Number,
            default:0
        },
        likedPersons:[{
            liker:{
                type:Schema.Types.ObjectId,
                ref:'User'
            }
        }],
    }]
})

module.exports = Comment = model('Comment',commentSchema)