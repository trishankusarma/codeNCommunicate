import React,{ useState , useEffect } from "react";

import "../../css/home/home.css";

import AxiosInstance from '../../utilsClient/AxiosInstance'

import Loader from '../Loader/Loader'

import Post from "../post/post";

import { useParams , useHistory } from "react-router-dom";

const SinglePost = () => {

        const [ post , setPost ] = useState(null)

        const { _id } = useParams()

        const history = useHistory()

        useEffect(async () => {
           
            const res = await AxiosInstance.get(`/post/${_id}`)

            if(res.data.success===1){
                   
               setPost(res.data.post)
            }else{
                history.pushState('/')
            }
        }, [])

        return (
            <div className="homeContainer">

             {
                post ?                
                  <Post post={post} key={post._id}/>
                :
                <div className="loader">
                    <Loader/>
                </div>
            }

            </div>
        );
};

export default SinglePost;
