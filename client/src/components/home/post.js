import React, { useState, useEffect, useContext } from "react";

import ImageSlider from "../imageSlider/imageSlider";

import parse from "html-react-parser";

import Axiosinstance from "../../utilsClient/AxiosInstance";

import CommonContext from "../../contexts/common/CommonContext";

import Comments from "../comments/comments";

import { useHistory } from "react-router-dom";

const Post = ({ post, profile , editPost , deletePost , userId }) => {
  const {
    isLogged,
    setError,
    setResponse,
    user,
    userFollowers,
    setUserFollowers,
  } = useContext(CommonContext);

  const [postLiked, setPostLiked] = useState(false);

  const [count, setCount] = useState(1);

  const [postNoOfLikes, setPostNoOfLikes] = useState(null);

  const [postNoOfComments, setPostNoOfComments] = useState(null);

  const [userFollowed, setUserFollowed] = useState(false);

  const [comment, setComment] = useState("");

  const [comments, setComments] = useState(null);

  const [closeComments, setCloseComments] = useState(true);

  const history = useHistory()

  useEffect(() => {
    if (!isLogged || !user || !userFollowers) {
      setError(count + " Authenticate to like, comment and follow");

      setUserFollowed(false);
      setPostLiked(false);

      setCount(count + 1);
      return;
    }

    setPostNoOfLikes(post.likes);
    setPostNoOfComments(post.no_of_comments);

    const isLiked = post.likedPersons.find(
      (liker) => JSON.stringify(liker.liker) === JSON.stringify(user._id)
    );

    if (isLiked) {
      setPostLiked(true);
    }

    const followed = userFollowers.find(
      (follower) =>
        JSON.stringify(follower.follower) === JSON.stringify(post.owner._id)
    );

    if (followed) {
      setUserFollowed(true);
    }
  }, [isLogged, user, userFollowers]);

  const LikePost = async () => {
    if (!isLogged) {
      setError(count + ". Authenticate to like, comment and follow!");

      setCount(count + 1);
      return;
    }

    const res = await Axiosinstance.patch(`/post/like/${post._id}`);

    if (res.data.success === 1) {
      setPostLiked(!postLiked);

      if (res.data.likeState === 1) {
        setPostNoOfLikes(postNoOfLikes + 1);
      } else {
        setPostNoOfLikes(postNoOfLikes - 1);
      }
    }
  };

  useEffect(() => {
    if (!isLogged || !user) {
      setError(count + " Authenticate to like, comment and follow");
      setCount(count + 1);
      return;
    }

    if (!userFollowers) {
      return;
    }

    const followed = userFollowers.find(
      (follower) =>
        JSON.stringify(follower.follower) === JSON.stringify(post.owner._id)
    );

    if (followed) {
      setUserFollowed(true);
    } else {
      setUserFollowed(false);
    }
  }, [userFollowers]);

  const followUser = async () => {
    if (!isLogged) {
      setError(count + ". Authenticate to like, comment and follow!");

      setCount(count + 1);
      return;
    }

    if (!userFollowed) {
      const res = await Axiosinstance.patch(`/user/follow/${post.owner._id}`);

      if (res.data.success === 1) {
        setUserFollowers([...userFollowers, { follower: post.owner._id }]);

        setUserFollowed(true);
      }
    } else {
      const res = await Axiosinstance.patch(`/user/unfollow/${post.owner._id}`);

      if (res.data.success === 1) {
        setUserFollowers(
          userFollowers.filter((follower) => follower.follower !== user._id)
        );

        setUserFollowed(false);
      }
    }
  };

  const likedStyle = {
    background: "green",
    fontSize: "800",
  };

  const followStyle = {
    background: "grey",
  };

  const addComment = async (e) => {
    e.preventDefault();

    if (!isLogged || !user) {
      setError(count + " Authenticate to like, comment and follow");

      setComment("");

      setCount(count + 1);
      return;
    }

    setCloseComments(false);

    let response;

    if (!comments) {
      response = await Axiosinstance.get(`/post/comment/${post._id}`);
    }

    const data = {
      content: comment,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await Axiosinstance.post(
      `/post/comment/${post._id}`,
      data,
      config
    );

    if (res.data.success === 1) {
      setResponse(res.data.msg);

      if (!comments) {
        setComments([...response.data.comments, res.data.comment]);
      } else {
        setComments([...comments, res.data.comment]);
      }
    } else {
      setError(res.data.msg);
    }

    setComment("");
  };

  const arrayBufferToBase64 = (buffer) => {
    var binary = "";

    var bytes = [].slice.call(new Uint8Array(buffer));

    bytes.forEach((b) => (binary += String.fromCharCode(b)));

    return window.btoa(binary);
  };

  const setImageUrl = (owner) => {
    if (owner.profileImage) {
      const base64Flag = `data:${owner.profileImageType};base64,`;

      const imageStr = arrayBufferToBase64(owner.profileImage.data);

      return base64Flag + imageStr;
    } else {
      return "image/me.jpg";
    }
  };

  const getComments = async () => {
    if (closeComments) {
      const res = await Axiosinstance.get(`/post/comment/${post._id}`);

      if (res.data.success === 1) {
        await setComments(res.data.comments);
      }
    }
    setCloseComments(!closeComments);
  };

const visitProfile = async (_id) => {

    history.replace(`/user?_id=${_id}`)
}

  return (
    <div class="outer-div">
      <div class="heading">
        <div class="left" style={{cursor:'pointer'}} onClick={()=>visitProfile(post.owner._id)}>
          <img src={setImageUrl(post.owner)} alt="" />
          <h4 style={{ color: "white" }}>{post.owner.name}</h4>
        </div>

        {!profile ? (
          <div class="right">
            <button>
              <a
                href={`https://codeforces.com/profile/${post.owner.cf_handle}`}
                target="_blank"
              >
                <img class="cf" src="image/cf.png" alt="" />
              </a>
            </button>

            <button>
              <a
                href={`https://www.codechef.com/users/${post.owner.cc_handle}`}
                target="_blank"
              >
                <img class="cc" src="image/cc.png" alt="cc" />
              </a>
            </button>

            <button>
              <a href={`${post.owner.ln_handle}`} target="_blank">
                <img class="linkdin cc" src="image/linkedin.png" alt="" />
              </a>
            </button>

            <button>
              <img
                class="follow cc"
                src="image/follow.png"
                alt="cc"
                onClick={followUser}
                style={userFollowed ? followStyle : null}
              />
            </button>
          </div>
        ) : 
          !userId
          ? 
          <div className="right">
              <button
                  onClick={()=>editPost(post._id)}
              >
                   EDIT
              </button>

              <button
                  onClick={()=>deletePost(post._id)}
              >
                   DELETE
              </button>
          </div>
          : null
        }
      </div>

      <form action="">
        <input
          type="text"
          name=""
          id=""
          placeholder="title.."
          value={post.title}
          readOnly
        />

        <br />

        <div className="description">{parse(post.description)}</div>

        <br />
      </form>

      <ImageSlider images={post.images} type={2} />

      <div class="like-count">
        <a href="">{postNoOfLikes} Likes</a>
        <a href="">{postNoOfComments} comments</a>
      </div>

      <div class="like-comment">
        <button onClick={LikePost} style={postLiked ? likedStyle : null}>
          Like
        </button>

        <button onClick={getComments}>comment</button>
        <button>share</button>
      </div>

      <div>
        <form className="write-comment" onSubmit={addComment}>
          <input
            type="text"
            placeholder="Write a comment. . ."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button type="submit">Add</button>
        </form>
      </div>

      <div style={{ marginTop: "100px" }}>
        <Comments
          comments={comments}
          closeComments={closeComments}
          setComments={setComments}
        />
      </div>
    </div>
  );
};

export default Post;
