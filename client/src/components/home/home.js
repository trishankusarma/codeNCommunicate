import React,{ useState , useEffect } from "react";

import "../../css/home/home.css";

import AxiosInstance from '../../utilsClient/AxiosInstance'

import Loader from '../Loader/Loader'

import Post from "../post/post";

import InfiniteScroll from "react-infinite-scroll-component";

const Home = () => {

        const [ posts , setPosts ] = useState(null)

        const [ skipIndex , setSkipIndex ] = useState(0)

        const [ loadMore , setLoadMore ] = useState(true)

        useEffect(async () => {

            const limit = 10
           
            const res = await AxiosInstance.get(`/?postType=0&limit=${limit}&skip=${skipIndex}`)

            if(res.data.posts && res.data.posts.length>0){
                 
                posts ? setPosts([...posts , ...res.data.posts]) : setPosts(res.data.posts)

                if(res.data.posts.length<limit)
                    setLoadMore(false)
            }else{
                setLoadMore(false)
            }

        }, [skipIndex])

        const fetchMoreData = ()=>{
             setSkipIndex(skipIndex+2)
        }

        return (
            <div className="homeContainer">

             {
                 posts 
        
                 ?  

                <InfiniteScroll

                    dataLength={posts.length}
                    next={fetchMoreData}
                    hasMore={loadMore}
                    loader={
                        loadMore ? 
                        <div className="loader">
                              <Loader/>
                        </div>  : null
                    }
                    >
                    {
                    
                                posts.length===0 
                                
                                ?
                                
                                <div className="loader" style={{textAlign:'center',marginTop:'20vh',fontSize:'5rem'}}>
                                    No posts to show
                                </div> 
                                
                                :
                                
                                posts.map((post)=>(
                                    <Post post={post} key={post._id} skipIndex={skipIndex} setSkipIndex={setSkipIndex} />
                                )) 

                        }
                </InfiniteScroll>

                :
                <div className="loader">
                    <Loader/>
                </div>
            }

            </div>
        );
};

export default Home;
