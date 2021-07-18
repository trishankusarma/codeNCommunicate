import React, { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./toast.css";
  
const Toast =(props)=>{

    useEffect(()=>{
        
        toast(props.msg)

        return ()=>{
            toast(null)
        }   
    },[props.msg]) 

    return (
    <>
     <div>
        <ToastContainer
          
          bodyClassName={props.classIs}
          hideProgressBar={true}
          autoClose={4000}
          closeOnClick={true}
         />
      </div>
    </>)
}

export default Toast ;