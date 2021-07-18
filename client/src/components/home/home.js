import React,{ useState , useEffect } from "react";

import "../../css/home/home.css";

import AxiosInstance from '../../utilsClient/AxiosInstance'

import Loader from '../Loader/Loader'

import Post from "./post";

const Home = () => {

        const [ posts , setPosts ] = useState(null)

        useEffect(async () => {
           
            const res = await AxiosInstance.get('/?postType=0')

            setPosts(res.data.posts)
        }, [])

        return (
            <div className="homeContainer">
               {
                   posts 
                    ?  
                       posts.length===0 
                      
                       ?
                       
                       <div className="loader" style={{textAlign:'center',marginTop:'20vh',fontSize:'5rem'}}>
                           No posts to show
                       </div> 
                       
                       :
                       
                       posts.map((post)=>(
                        <Post post={post} key={post._id}/>
                       )) 
                   :
                   <div className="loader">
                       <Loader/>
                   </div>
               }
            </div>
        );
};

export default Home;
