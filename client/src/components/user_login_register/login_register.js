import React, { useState , useContext , useEffect } from "react"

import "../../css/login_Register/login_register.css";

import Login from './login'
import Register from './register'

const Login_register = () => {

  const [ classList , setclassList ] = useState(false)  
  
  return (
    <div className="login_reg_container">
      <div className={ classList ? "cont s--signup" : "cont" } >
         
        <Login />
        <div className="sub-cont">
          <div className="login_reg_container_img">
            <div className="login_reg_container_img__text m--up">
              <h2>New here?</h2>
              <p>Sign up and be a part of our community!</p>
            </div>
            <div className="login_reg_container_img__text m--in">
              <h2>One of us?</h2>
              <p>If you already has an account, just sign in. </p>
            </div>
            <div className="login_reg_container_img__btn" onClick={()=>setclassList(!classList)}>
              <span className="m--up">Sign Up</span>
              <span className="m--in">Sign In</span>
            </div>
          </div>
          
          <Register />
        </div>
      </div>
    </div>
  );
};

export default Login_register;
