import React, { useEffect, useState, useContext } from "react";

import "../../css/myCommunity/index.css";

import AxiosInstance from "../../utilsClient/AxiosInstance";
import CommonContest from "../../contexts/common/CommonContext";

import { Button } from '@material-ui/core'

import Loader from "../Loader/Loader";

import { useHistory } from "react-router-dom";

const MyCommunity = () => {
  const [following, setFollowing] = useState(null);

  const { setError, isLogged } = useContext(CommonContest);

  const history = useHistory()

  useEffect(async () => {
    const res = await AxiosInstance.get("/user/getFollowing");

    console.log(res.data.user.followers);

    if (res.data.success === 1) {
      return setFollowing(res.data.user.followers);
    }
    setError(res.data.msg);
  }, []);

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

  const unfollowUser = async (_id) => {
    if (!isLogged) {
      setError("Authenticate to like, comment and follow!");

      return;
    }

    const res = await AxiosInstance.patch(`/user/unfollow/${_id}`);

    if (res.data.success === 1) {
      setFollowing(following.filter((follow) => follow.follower._id !== _id));
    }
  };

  const visitProfile = async (_id) => {

      history.replace(`/user?_id=${_id}`)
  }

  return (
    <div className="container" id="app-container">
      <ul className="contact-list">
        {following ? (
          following.map((f) => (
            <li>
              <img 
                 src={setImageUrl(f.follower)} 
                 onClick={()=>visitProfile(f.follower._id)}
                 style={{cursor:'pointer'}}
              />
              <div className="contact-info">
                <h3 
                    className="heading--name"
                    onClick={()=>visitProfile(f.follower._id)}
                    style={{cursor:'pointer'}}
                >{f.follower.name}</h3>
                
                <div className="right">
                  <Button style={{marginLeft:'10px'}}>
                    <a
                      href={`https://codeforces.com/profile/${f.follower.cf_handle}`}
                      target="_blank"
                    >
                    codeforces
                    </a>
                  </Button>

                  <Button style={{marginLeft:'10px'}}>
                    <a
                      href={`https://www.codechef.com/users/${f.follower.cc_handle}`}
                      target="_blank"
                    >
                      codechef
                    </a>
                  </Button>

                  <Button style={{marginLeft:'10px'}}>
                    <a href={`${f.follower.ln_handle}`} target="_blank">
                     linkedin
                    </a>
                  </Button>
                </div>
              
              </div>

              <button
                type="button"
                className="btn  btn-danger"
                style={{ borderRadius: "50px" }}
                onClick={() => unfollowUser(f.follower._id)}
              >
                Unfollow
              </button>
            </li>
          ))
        ) : (
          <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',marginTop:'20vh'}}>
                      <Loader />
           </div>
        )}
      </ul>
    </div>
  );
};

export default MyCommunity;
