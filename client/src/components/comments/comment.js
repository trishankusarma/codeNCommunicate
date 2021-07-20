import React, { useState, useContext, useEffect } from "react";

import AxiosInstance from "../../utilsClient/AxiosInstance";

import Reply from "./reply";
import CommonContext from "../../contexts/common/CommonContext";
import "../comments/comment.css";

const Comment = ({ comment, setDeleteCommentId }) => {
  const { user, isLogged, setError, setResponse } = useContext(CommonContext);

  const [reply, setReply] = useState("");

  const [replies, setReplies] = useState(comment.replies);

  const [commentLiked, setCommentLiked] = useState(false);

  const [noOfLikes, setNoOfLikes] = useState(comment.likes);

  const [editCommentState, setEditCommentState] = useState(0);

  const [content, setContent] = useState(comment.content);

  const [prevContent, setPrevContent] = useState(reply.content);

  const [deleteReplyId, setDeleteReplyId] = useState(null);

  const [viewReplies, setViewReplies] = useState(false);

  useEffect(() => {
    if (deleteReplyId) {
      setReplies(replies.filter((reply) => reply._id !== deleteReplyId));
    }
  }, [deleteReplyId]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      content: reply,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await AxiosInstance.patch(
      `/post/comment/reply/${comment._id}`,
      data,
      config
    );

    if (res.data.success === 1) {
      setReplies(res.data.replies);
      setReply("");
      setResponse(res.data.msg);
    } else {
      setError(res.data.msg);
    }
  };

  useEffect(async () => {
    if (!user) {
      return;
    }

    const commentLiked = await comment.likedPersons.find(
      (liker) => JSON.stringify(liker.liker) === JSON.stringify(user._id)
    );

    if (commentLiked) {
      setCommentLiked(true);
    }
  }, [user]);

  const likeComment = async () => {
    const res = await AxiosInstance.patch(`/post/comment/like/${comment._id}`);

    if (res.data.success === 1) {
      if (commentLiked) {
        setNoOfLikes(noOfLikes - 1);
      } else {
        setNoOfLikes(noOfLikes + 1);
      }

      setCommentLiked(!commentLiked);
    } else {
      setError(res.data.msg);
    }
  };

  const editComment = async () => {
    if (editCommentState === 0) {
      setEditCommentState(1);

      return;
    }

    const res = await AxiosInstance.patch(
      `/post/comment/edit_comment/${comment._id}`,
      {
        content,
      }
    );

    if (res.data.success === 0) {
      setContent(prevContent);
      setError(res.data.msg);
    } else {
      setPrevContent(content);
      setResponse(res.data.msg);
    }

    setEditCommentState(0);
  };

  const deleteComment = async () => {
    const res = await AxiosInstance.delete(
      `/post/comment/delete_comment/${comment._id}`
    );

    if (res.data.success) {
      setResponse(res.data.msg);
      setDeleteCommentId(comment._id);
    } else {
      setError(res.data.msg);
    }
  };

  const likedStyle = {
    background: "green",
    fontSize: "800",
  };
const replyImg="https://image.flaticon.com/icons/png/128/1933/1933011.png";
  return (
    <div className="comment">
      <div className="author">
        <img src="https://gravatar.com/avatar/2bed492de7e05b95ffd2581cd0f4b83d?s=60&d=identicon" />
        <button className="author_name">{comment.author.name}</button>
      </div>
      {editCommentState === 0 ? (
        <input className="comment_box" value={content} type="text" readOnly />
      ) : (
        <input
          type="text"
          className="comment_box" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      )}
      <br />
      {isLogged ? (
        <div className="like_comment_delete">
        <div>
          <button
          className="like"
            onClick={likeComment}
            style={commentLiked ? likedStyle : null}
          >
            Like
          </button>
          </div>
          {user && user._id === comment.author._id ? (
            <div>
              <button  className="edit" onClick={editComment}>Edit</button>
              <button  className="delete" onClick={deleteComment}>Delete</button>
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="likes_ct_rply">
      <a className="no_of_like">
      {noOfLikes} likes</a>
      <div className="reply">
      <img className="rply_img" src={replyImg}/>
          <button className="view_reply" onClick={() => {
              setViewReplies(!viewReplies)
              console.log('clicked',viewReplies)
          }}>
            {viewReplies ? "Close Replies" : "View Replies"}
          </button>
      </div>
      </div>
      <br />
      {viewReplies &&
        replies &&
        replies.map((reply) => (
          <Reply
            reply={reply}
            commentId={comment._id}
            key={reply._id}
            setDeleteReplyId={setDeleteReplyId}
          />
        ))}
      {isLogged ? (
        <form onSubmit={onSubmit} style={{minHeight:"70px"}}>
          <input
          className="comment_box"
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Give reply..."
            required
          />
          <button className="send" type="submit">Send Reply</button>
        </form>
      ) : null}
      <br />
    </div>
  );
};

export default Comment;
