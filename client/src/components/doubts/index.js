import React,{ useState , useEffect } from "react";

import "../../css/home/home.css";

import AxiosInstance from '../../utilsClient/AxiosInstance'

import Loader from '../Loader/Loader'

import Post from "../post/post";

import InfiniteScroll from "react-infinite-scroll-component";

const Home = () => {

        const [ doubts , setDoubts ] = useState(null)

        const [ skipIndex , setSkipIndex ] = useState(0)

        const [ loadMore , setLoadMore ] = useState(true)

        useEffect(async () => {

            const limit = 10
           
            const res = await AxiosInstance.get(`/?postType=1&limit=${limit}&skip=${skipIndex}`)

            if(res.data.doubts && res.data.doubts.length>0){
                 
                doubts ? setDoubts([...doubts , ...res.data.doubts ]) : setDoubts(res.data.doubts)

                if(res.data.doubts.length<limit)
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
                 doubts 
        
                 ?  

                <InfiniteScroll

                    dataLength={doubts.length}
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
                    
                                doubts.length===0 
                                
                                ?
                                
                                <div className="loader" style={{textAlign:'center',marginTop:'20vh',fontSize:'5rem'}}>
                                    No Doubts to show
                                </div> 
                                
                                :
                                
                                doubts.map((post)=>(
                                    <Post post={post} key={post._id} skipIndex={skipIndex} setSkipIndex={setSkipIndex} doubt={true}/>
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
