import React, { useState , useContext , useEffect } from "react";

import { Link , useHistory } from "react-router-dom";

import CommonContext from '../../contexts/common/CommonContext'

const Login = () => {

    const history = useHistory()

    const { login , setError ,setResponse , isLogged } = useContext(CommonContext)
    
    const [user, setUser] = useState({
      email_or_name: "",
      password: "",
    })
  
    const { email_or_name, password } = user;
  
    const handleChange = (e) => {
      setUser({
        ...user,
        [e.target.name]: e.target.value,
      });
    }
  
    useEffect(()=>{
      setError(null)
      setResponse(null)
    },[])
  
    const onSubmit = async (e) => {
      e.preventDefault()
  
      if(password.length<6){
         setError('Password Length should be minimum 6')
         return
      }
  
      await login(user)
    }
  
    useEffect(()=>{
        if(isLogged){
           
          setTimeout(()=>{
             history.push('/')     
          },2000)
        }
    },[isLogged])  

    return (
        <form className="form sign-in" style={{ top: "10vh" }} onSubmit={onSubmit}>
            <h2>Welcome back,</h2>
            <label>
                <span>Email/Username</span>
                <input type="text" name="email_or_name" value={email_or_name} onChange={handleChange} required />
            </label>
            <label>
                <span>Password</span>
                <input type="password" name="password" value={password} onChange={handleChange} required />
            </label>
            <p className="forgot-pass">
                <Link to="/user/forgetPassword">
                    Forgot Password ?
                </Link>
            </p>
            <button type="submit" className="submit">
                Sign In
            </button>
        </form>
    );
};

export default Login;
