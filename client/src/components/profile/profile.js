import { useEffect, useState, useContext } from "react";

import AxiosInstance from "../../utilsClient/AxiosInstance";

import CommonContext from "../../contexts/common/CommonContext";

import "../../css/profile/profile.css";

import Loader from "../Loader/Loader";
import Post from "../home/post";

import { useHistory } from 'react-router-dom'

import queryString from 'query-string'

const Profile = ({location}) => {
  const { isLogged, logOut, setError , user, setActiveLi , getUserPosts , setUserPosts, userPosts , setResponse  } = useContext(CommonContext);

  const history = useHistory()

  const [posts, setPosts] = useState(null);

  const arrayBufferToBase64 = (buffer) => {
    var binary = "";

    var bytes = [].slice.call(new Uint8Array(buffer));

    bytes.forEach((b) => (binary += String.fromCharCode(b)));

    return window.btoa(binary);
  };

  const setImageUrl = (owner) => {
    if (owner && owner.profileImage) {
      const base64Flag = `data:${owner.profileImageType};base64,`;

      const imageStr = arrayBufferToBase64(owner.profileImage.data);

      return base64Flag + imageStr;
    } else {
      return "https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTU0NjQzOTk4OTQ4OTkyMzQy/ansel-elgort-poses-for-a-portrait-during-the-baby-driver-premiere-2017-sxsw-conference-and-festivals-on-march-11-2017-in-austin-texas-photo-by-matt-winkelmeyer_getty-imagesfor-sxsw-square.jpg";
    }
  };

  const { _id } = queryString.parse(location.search)

  const [coder, setCoder] = useState(
      _id ? null : user
  );

  useEffect(()=>{
      if(user)
         setCoder(user)
  },[user])

  useEffect(async () => {

    let res

    if(_id){
        res = await AxiosInstance.get(`/user?profile_id=${_id}`)

        console.log(res.data);

        if (res.data.success === 1) {
          setCoder(res.data.user);
          setPosts(res.data.posts);
          return;
        }
        setError(res.data.msg);

        setActiveLi(5)
    }else{
      await getUserPosts()
    }
  }, []);

  const EditProfile = ()=>{
       return history.replace(`/user/edit`)
  }

  const editPost = (postId)=>{

      setActiveLi(2)

      history.replace(`/public/add?editId=${postId}`)
  }

  const deletePost = async (postId)=>{

      const res = await AxiosInstance.delete(`/post/${postId}`)

      if(res.data.success){

         setResponse("Post deleted")

        setUserPosts(
          userPosts.filter((post)=> post._id !== postId )
        )
      }

      setError(res.data.msg)
  }

  console.log(coder)

  return (
    <div
      className="profile-page"
      style={{ width: "100vw", display: "flex", justifyContent: "center" }}
    >
      {coder && (posts || userPosts) ? (
        <div style={{ width: "100vw" }}>
          <div className="container do">
            <div className="main main-raised">
              <div className="profile-content">
                <div className="container">
                  <div className="row">
                    <div className="col-md-6 ml-auto mr-auto">
                      <div className="profile">
                        <div className="avatar">
                          <img
                            src={setImageUrl(coder)}
                            alt="Circle Image"
                            className="img-raised rounded-circle img-fluid"
                          />
                        </div>
                        <div className="name">
                          <h3 className="title">{coder.name}</h3>
                          <h6>{coder.role}</h6>
                          <p>
                            <span style={{ padding: "1rem" }}>
                              {coder.email}{" "}
                            </span>
                            <span
                              style={{
                                padding: "1rem",
                                fontWeight: "bolder",
                                color: "blue",
                              }}
                            >
                              {coder.noOfFollowers} followers
                            </span>
                          </p>
                          <div class="right">
                            {coder.cf_handle && (
                              <button>
                                <a
                                  href={`https://codeforces.com/profile/${coder.cf_handle}`}
                                  target="_blank"
                                >
                                  <img class="cf" src="image/cf.png" alt="" />
                                </a>
                              </button>
                            )}

                            {coder.cc_handle && (
                              <button>
                                <a
                                  href={`https://codeforces.com/profile/${coder.cc_handle}`}
                                  target="_blank"
                                >
                                  <img class="cc" src="image/cc.png" alt="cc" />
                                </a>
                              </button>
                            )}

                            {coder.ln_link && (
                              <button>
                                <a href={`${coder.ln_link}`} target="_blank">
                                  <img
                                    class="linkdin cc"
                                    src="image/linkedin.png"
                                    alt=""
                                  />
                                </a>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="description text-center">
                    <p>{coder.about}</p>
                  </div>
  
                  {
                    !_id 
                    ? 
                    <button 
                        id="save" 
                        className = "btn btn-primary" 
                        onClick={EditProfile} 
                        style={{border:'1px solid black', left:'50%',transform:'translateX(-50%)'}}
                  >
                      EditProfile
                  </button> 
                  : null
                  }

                  <div className="homeContainer">
                      {
                        _id 
                        ?  
                        <div>
                           {posts ? (
                                posts.map((post) => (
                                  <Post post={post} key={post._id} profile={true} userId={_id}/>
                                ))
                              ) : (
                                <div className="loader">
                                  <Loader />
                                </div>
                              )}
                        </div>
                        :
                        <div>
                            {userPosts ? (
                                userPosts.map((post) => (
                                  <Post post={post} key={post._id} profile={true} editPost={editPost} deletePost={deletePost}/>
                                ))
                              ) : (
                                <div className="loader">
                                  <Loader />
                                </div>
                              )}
                        </div>
                      }
                  </div>
                </div>
              </div>
            </div>

            <footer className="footer text-center ">
              <p>
                Made with{" "}
                <a
                  href="https://demos.creative-tim.com/material-kit/index.html"
                  target="_blank"
                >
                  Coding Community
                </a>{" "}
                by Trishanku Sarma and Harsh Agarwala
              </p>
            </footer>
          </div>
        </div>
      ) : (
        <div className="loader">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Profile;
