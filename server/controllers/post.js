const { Post , Comment } = require('../models')
const post = require('../models/post')

const internalServerError = {
    success:0,
    msg:'Internal Server Error',
    post:null
}

const postController = {

    //title description markdown images:{ image , imageType } likes comments:{comment:{commentator,reply,likes}} owner 
    
    getPostById: async (req,res)=>{

        try {
            
           const post = await Post.findById(req.params._id)

           if(!post){
            return res.json({
                success:0,
                msg:'post unavailable',
            })
        }

           return res.json({
              success:1,
              post
           })

        } catch (error) {
           
            return res.json(internalServerError)
        }
    },

    getAllPost: async (req,res)=>{

        // profileImage profileImageType
        try {
           
            const { postType , limit , skip }  = req.query

            console.log("postType" , postType, "limit", limit , "skip", skip )

            //type===0 -> Posts
            //type===1 -> Doubts
            
            switch(parseInt(postType)){
        
                case 0:
                    const posts = await Post.find({
                        postType : 0
                    })
                    .sort({
                        "created_at":-1
                    }).limit(parseInt(limit))
                    .skip(parseInt(skip))
                    .populate('comments','content author likes')
                    .populate('owner','name profileImage profileImageType cf_handle cc_handle ln_link')    

                    console.log("posts", posts)
        
                    return res.json({
                        success:1,
                        posts
                    })
                
                case 1:
                    const doubts = await Post.find({
                        postType : -1
                    }).sort({
                        "created_at":-1
                    }).limit(parseInt(limit))
                    .skip(parseInt(skip))
                    .populate('comments','content author likes')
                    .populate('owner','name profileImage profileImageType cf_handle cc_handle ln_link')    

                    console.log(doubts)
        
                    return res.json({
                        success:1,
                        doubts
                    })
            }
        } catch (error) {
            console.log(error)
            res.json(internalServerError)
        }
    },

    createPost: async (req,res)=>{
       
        try {
            const { title , description , postType  } = req.body

            const post = new Post({
                title,
                description:description,
                postType,
                created_at:new Date(),
                owner : req.user._id
            })

            if(req.files){

                post['images'] = []

                req.files.forEach((img)=>{

                    post['images'] = post['images'].concat({
                        image:img.buffer,
                        imageType:img.mimetype
                    })                   
                })
            }

            await post.save()

            res.json({
                success:1,
                msg:'New Post Added',
                post
            })
            
        } catch (error) {

            return res.json(internalServerError)            
        }
    },

    updatePost:async (req,res)=>{
        
        try {
            const _id = req.params._id

            const post = await Post.findById(_id)

            if(!post){
                return res.json({
                    success:0,
                    msg:'post unavailable',
                })
            }

            const updates = Object.keys(req.body)

            updates.forEach(update=>post[update]=req.body[update])

            post['images'] = []

            if(req.files && req.files.images){
                req.files.images.map((img)=>{
                    post['images'] = post['images'].concat({
                        image:img.buffer,
                        imageType:img.mimetype
                    })                   
                })
            }

            await post.save()

            return res.json({
                success:1,
                msg:'Post Updated',
                post
            })

        } catch (error) {

            console.log(error)
            
            return res.json(internalServerError)

        }
    }, 
    
    deletePost:async (req,res)=>{

        try {
            
            const post = await Post.findById(req.params._id)

            if(!post){
                return res.json({
                    success:0,
                    msg:'post unavailable',
                })
            }

            post.remove()

            return res.json({
                success:1,
                msg:'Post Deleted',
                post
            })
            
        } catch (error) {
            
            return res.json(internalServerError)

        }
    },

    postImageError : (error,req,res,next)=>{
        
        res.json({
            
            success:0,
            msg:'Please provide images(maxm allowed 3) less than 1MB ',
            user:null
        })
    },

    likePost : async (req,res)=>{

      try {
        const user = req.user
        
        const _id = req.params._id

        const post = await Post.findById(_id,{
            likedPersons:true,
            likes:true
        })

        if(!post){
            return res.json({
                success:0,
                msg:'post unavailable',
            })
        }

        //if the user has liked or or not 
        const liked = post['likedPersons'].find(person=>JSON.stringify(person.liker)===JSON.stringify(user._id))

        if(liked){

            post['likedPersons'] = post['likedPersons'].filter(person=>JSON.stringify(person.liker)!==JSON.stringify(user._id))

            post['likes'] = post['likes'] - 1

            await post.save()

            await post
                  .populate({
                    path: 'likedPersons',
                    populate: {
                      path: 'liker',
                      select:'name'
                    }
                  }).execPopulate()

            return res.json({
                success:1,
                likeState:0,
                msg:'Post Unliked',
                post
            })
        }

        post['likedPersons'] = post['likedPersons'].concat({
            liker:user._id
        })

        post['likes'] = post['likes'] + 1

        await post.save()

        await post
                  .populate({
                    path: 'likedPersons',
                    populate: {
                      path: 'liker',
                      select:'name'
                    }
                  }).execPopulate()

        return res.json({
            success:1,
            likeState:1,
            msg:'Post liked',
            post
        })
      } catch (error) {
          
        res.json(internalServerError)
      }
    },

    postLikedPersons : async (req,res)=>{
        
        try {

        const _id = req.params._id
  
        const post = await Post.findById(_id,{
            
            likedPersons:true,
            likes:true

        }).populate('likedPersons.liker','name')

        if(!post){
            return res.json({
                success:0,
                msg:'post unavailable',
            })
        }
        
        return res.json({
            success:1,
            likedDevs:post['likedPersons'],
            likes:post['likes']
        })
          
        } catch (error) {
            
          res.json(internalServerError)
        }
    },

    getAllComments : async (req,res)=>{
        
        try {
            
            const _id = req.params._id

            const post = await Post.findById(_id,{
                _id:true
            })
            
            await post
            .populate({
                path:'comments',
                populate:{
                    path:'replies author',
                    select:'name',
                    populate: {
                      path: 'author',
                      select:'name'
                    }
                  }
            })
            .execPopulate()

            res.json({
                success:1,
                msg:'Comment Posted',
                comments:post.comments
            })

        } catch (error) {
            res.json(internalServerError)
        }
    },

    giveComment : async (req,res)=>{
       
        try {
            
            const _id = req.params._id

            const comment = new Comment({
                content : req.body.content,
                author : req.user._id,
                likes : 0,
                post : _id
            })

            if(!comment){
                return res.json({
                    success:0,
                    msg:'comment unavailable',
                })
            }

            await comment.save()

            await comment
            .populate({
                  path:'replies author',
                  select:'name',
                  populate: {
                    path: 'author',
                    select:'name'
                  }
            })
            .execPopulate()

            res.json({
                success:1,
                msg:'Comment Posted',
                comment
            })

        } catch (error) {
            res.json(internalServerError)
        }
    },

    giveReplyComment : async (req,res)=>{

        try {
            const { content } = req.body

            const { comment_id } = req.params

            const base_comment = await Comment.findById(comment_id,{
                replies:true
            })

            if(!base_comment){
                return res.json({
                    success:0,
                    msg:'comment unavailable',
                })
            }

            base_comment['replies'] = base_comment['replies'].concat({
                content,
                author:req.user._id,
                likes:0
            })            

            await base_comment.save()

            await base_comment
                  .populate({
                    path: 'replies',
                    populate: {
                      path: 'author',
                      select:'name'
                    }
                  }).execPopulate()

            return res.json({
                success:1,
                msg:'commented on comment',
                replies:base_comment.replies
            })

        } catch (error) {
            return res.json(internalServerError)
        }
    },

    likeComment : async (req,res)=>{
        try {
            
            const { comment_id } = req.params 

            const user = req.user

            const base_comment = await Comment.findById(comment_id,{
                likedPersons:true,
                likes:true
            })

            if(!base_comment){
                return res.json({
                    success:0,
                    msg:'comment unavailable',
                })
            }

            //if the user has liked or or not 
            const liked = base_comment['likedPersons'].find(person=>JSON.stringify(person.liker)===JSON.stringify(user._id))

            if(liked){

                base_comment['likedPersons'] = base_comment['likedPersons'].filter(person=>JSON.stringify(person.liker)!==JSON.stringify(user._id))

                base_comment['likes'] = base_comment['likes'] - 1
            }else{

                base_comment['likedPersons'] = base_comment['likedPersons'].concat({
                    liker:user._id
                })

                base_comment['likes'] = base_comment['likes'] + 1

           }

            await base_comment.save()

            await base_comment
                  .populate({
                    path: 'likedPersons',
                    populate: {
                      path: 'liker',
                      select:'name'
                    }
                  }).execPopulate()

            return res.json({
                success:1,
                msg:'base_comment liked state change',
                base_comment
            })

        } catch (error) {
            res.json(internalServerError)
        }
    },

    likeReply : async (req,res)=>{
        try {
            
            const { comment_id } = req.params 

            const { reply_id } = req.query

            const user = req.user

            const base_comment = await Comment.findById(comment_id,{
                replies:true
            })

            if(!base_comment){
                return res.json({
                    success:0,
                    msg:'comment unavailable',
                })
            }

            reply_to_liked = await base_comment['replies'].find(reply=>reply._id==reply_id)

            //if the user has liked or or not 
            const liked = reply_to_liked['likedPersons'].find(person=>JSON.stringify(person.liker)===JSON.stringify(user._id))

            if(liked){

                reply_to_liked['likedPersons'] = reply_to_liked['likedPersons'].filter(person=>JSON.stringify(person.liker)!==JSON.stringify(user._id))

                reply_to_liked['likes'] = reply_to_liked['likes'] - 1
                
            }else{

            reply_to_liked['likedPersons'] = reply_to_liked['likedPersons'].concat({
                    liker:user._id
            })
    
            reply_to_liked['likes'] = reply_to_liked['likes'] + 1
            }

            base_comment['replies'] = await base_comment['replies'].map(reply=>{
              
                if(reply._id==reply_id){
                    return reply_to_liked
                }
              
                return reply
            })

            await base_comment.save()

            await base_comment
                  .populate({
                    path: 'replies',
                    populate: {
                      path: 'likedPersons',
                      populate:{
                          path:'liker',
                          select:'name'
                      }
                    }
                  }).execPopulate()


            return res.json({
               success:1,
               msg:'Comment liked state changed',
               base_comment
            })

        } catch (error) {
            res.json(internalServerError)
        }
    },

    editComment : async (req,res)=>{
        try {
            
            const { comment_id } = req.params 

            const { content } = req.body

            const base_comment = await Comment.findById(comment_id,{
                 content : true,
                 author: true
            })

            if(!base_comment){
                return res.json({
                    success:0,
                    msg:'comment unavailable',
                })
            }

            if(JSON.stringify(base_comment['author'])===JSON.stringify(req.user._id)){

                base_comment['content'] = content

                await base_comment.save()

                return res.json({
                    success:1,
                    msg:'base_comment edited ',
                    base_comment
                })
            }

            return res.json({
                success:0,
                msg:'edit access forbidden',
                base_comment
            })

        } catch (error) {
            res.json(internalServerError)
        }
    },

    editReply : async (req,res)=>{
        try {
            
            const { comment_id } = req.params 

            const { reply_id } = req.query

            const { content } = req.body

            const base_comment = await Comment.findById(comment_id,{
                replies:true
            })

            if(!base_comment){
                return res.json({
                    success:0,
                    msg:'comment unavailable',
                })
            }

            reply_to_edit = await base_comment['replies'].find(reply=>reply._id==reply_id)

            if(JSON.stringify(reply_to_edit['author'])===JSON.stringify(req.user._id)){

                    reply_to_edit['content'] = content
        
                    base_comment['replies'] = await base_comment['replies'].map(reply=>{
                    
                        if(reply._id==reply_id){
                            return reply_to_edit
                        }
                    
                        return reply
                    })

                    await base_comment.save()

                    return res.json({
                        success:1,
                        msg:'Comment_Reply edited',
                        base_comment
                    })
            }

            return res.json({
                success:0,
                msg:'Comment_Reply edit forbidden',
                base_comment
            })

        } catch (error) {
            res.json(internalServerError)
        }
    },

    deleteComment : async (req,res)=>{
        try {
            
            const { comment_id } = req.params 

            const base_comment = await Comment.findById(comment_id,{
                author:true
            })

            if(!base_comment){
                return res.json({
                    success:0,
                    msg:'comment unavailable',
                })
            }

            if(JSON.stringify(base_comment['author'])===JSON.stringify(req.user._id)){

                await base_comment.remove()

                return res.json({
                    success:1,
                    msg:'base_comment deleted',
                    base_comment
                })
            }

            return res.json({
                success:0,
                msg:'base_comment deletion forbidden',
                base_comment
            })

        } catch (error) {
            res.json(internalServerError)
        }
    },

    deleteReply : async (req,res)=>{
        try {
            
            const { comment_id } = req.params 

            const { reply_id } = req.query

            const base_comment = await Comment.findById(comment_id,{
                replies:true
            })

            if(!base_comment){
                return res.json({
                    success:0,
                    msg:'Comment Unavailable'
                })
            }

            base_comment['replies']  = await base_comment['replies'].filter(reply=>reply._id!=reply_id)

            await base_comment.save()

            return res.json({
               success:1,
               msg:'Comment_Reply deleted',
               base_comment
            })

        } catch (error) {
            res.json(internalServerError)
        }
    }
}

module.exports = postController