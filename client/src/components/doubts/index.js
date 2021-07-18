import React,{ useState , useEffect } from "react";

import "../../css/home/home.css";

import AxiosInstance from '../../utilsClient/AxiosInstance'

import Loader from '../Loader/Loader'

import Post from "../home/post";

const Home = () => {

        const [ doubts , setDoubts ] = useState(null)

        useEffect(async () => {
           
            const res = await AxiosInstance.get('/?postType=1')

            setDoubts(res.data.doubts)
        }, [])

        return (
            <div className="homeContainer">
               {
                   doubts 
                    ?  
                      doubts.length===0 ?
                    
                      <div className="loader" style={{textAlign:'center',marginTop:'20vh',fontSize:'5rem'}}>
                          No doubts to show
                      </div>

                      : 
                      
                      doubts.map((doubt)=>(
                        <Post post={doubt} key={doubt._id}/>
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
