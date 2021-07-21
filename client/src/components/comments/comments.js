import React,{ useState , useEffect } from 'react'

import Comment from './comment'

import '../../css/home/comments.css'

const Comments = ({comments , closeComments , setComments, setImageUrl }) => {

    const [ deleteCommentId , setDeleteCommentId ] = useState(null)

    useEffect(() => {
        
        if(deleteCommentId){
            setComments(comments.filter((comment)=>comment._id!==deleteCommentId))

            setDeleteCommentId(null)
        }
    }, [deleteCommentId])
    
    return (
        <div className='commentsSection'>
            {
                !closeComments && comments && comments.map((comment)=>(
                    <Comment comment={comment} key={comment._id} setDeleteCommentId={setDeleteCommentId} setImageUrl={setImageUrl}/>
                ))
            }
        </div>
    )
}

export default Comments
