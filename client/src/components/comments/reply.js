import React,{ useContext , useState , useEffect } from 'react'

import CommonContext from '../../contexts/common/CommonContext'

import AxiosInstance  from '../../utilsClient/AxiosInstance'

const Reply = ({reply , commentId , setDeleteReplyId , setImageUrl }) => {

    const { user , isLogged , setError , setResponse } = useContext(CommonContext)

    const [ replyLiked , setReplyLiked ] = useState(false)

    const [ noOfLikes , setNoOfLikes ] = useState(reply.likes)

    const [ content , setContent ] = useState(reply.content)

    const [ prevContent , setPrevContent ] = useState(reply.content)

    const [ editReplyState , setEditReplyState ] = useState(0)

    useEffect(async () => {

        if(!user){
            return
        }
         
         const replyLiked = await reply.likedPersons.find((liker)=>JSON.stringify(liker.liker)===JSON.stringify(user._id))

         if(replyLiked){
             setReplyLiked(true)
         }

    },[user])

    const likeReply = async()=>{

        const res = await AxiosInstance.patch(`/post/comment/reply_like/${commentId}/?reply_id=${reply._id}`)

        if(res.data.success===1){

            if(replyLiked){
                setNoOfLikes(noOfLikes-1)
            }else{
                setNoOfLikes(noOfLikes+1)
            }

            setReplyLiked(!replyLiked)
        }else{
            setError(res.data.msg)
        }
    }

    const editReply = async()=>{

        if(editReplyState===0){

            setEditReplyState(1)

            return
        }

        const res = await AxiosInstance.patch(`/post/comment/edit_reply/${commentId}?reply_id=${reply._id}`,{
            content
        })

        if(res.data.success===0){
            setContent(prevContent)
            setError(res.data.msg)
        }else{
            setPrevContent(content)
            setResponse(res.data.msg)
        }

        setEditReplyState(0)
    }

    const deleteReply = async()=>{
           
       const res =  await AxiosInstance.delete(`/post/comment/delete_reply/${commentId}?reply_id=${reply._id}`)

       if(res.data.success===1){
           setResponse(res.data.msg)
           setDeleteReplyId(reply._id)
       }else{
           setError(res.data.msg)
       }
    }

    const likedStyle = {
        background:'green',
        fontSize:'800'
    }

    return (
        <div className="comment" style={{marginLeft:'50px'}}>

            <div className="author">
                <img src={setImageUrl(reply.author)}/>
                <button className="author_name">{reply.author.name}</button>
            </div>

            {
                editReplyState===0
                  ?  
                  <input className="comment_box" value={content} type="text" readOnly />

                  : 
                  <input 
                     type='text'
                     value={content}
                     className="comment_box" 
                     onChange={(e)=>setContent(e.target.value)}
                  />
            }                        
            <br/>
            {
                isLogged ?
               
               <div className="like_comment_delete">
                    <button
                        onClick={likeReply}
                        className="like"
                        style={ replyLiked ? likedStyle : null}
                    >
                        Like
                    </button>
                    {
                        user._id===reply.author._id 
                        ? 
                        <div>
                            <button
                               onClick={editReply}
                               className="edit" 
                            >
                                Edit
                            </button>
                            <button
                               onClick={deleteReply}
                               className="edit" 
                            >
                                Delete
                            </button>
                        </div> 
                        : 
                        null
                    }
                </div>
            
               : null
            }

         <a className="no_of_like">
                {noOfLikes} 
          likes
         </a>

        </div>   
    )
}

export default Reply
