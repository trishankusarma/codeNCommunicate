import React from 'react'
import Loader from "react-loader-spinner";

const NoResults = () => {
    return (
        <div>
                <Loader
                
                    type="ThreeDots"
                    color="#4fc3f7"
                    height= "100" 
                    width= "100"
             />
        </div>
    )
}
export default NoResults;