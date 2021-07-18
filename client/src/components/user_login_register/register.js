import React,{ useState,useContext ,useEffect } from 'react'

import { Link } from 'react-router-dom'

import { Button } from "@material-ui/core";

import CommonContext from '../../contexts/common/CommonContext'

const Register = () => {

    const { register , setError ,setResponse  } = useContext(CommonContext)

    useEffect(()=>{
        setError(null)
        setResponse(null)
    },[])

    const [ user , setUser ] = useState({
        name:'',
        email:'',
        password:'',
        re_password:''
    })

    const { name , email , password, re_password } = user

    const handleChange = (e)=>{
        setUser({
            ...user,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit = async (e)=>{
        e.preventDefault()
        
        if(password.length<6){
            setError('Password Length should be minimum 6')
            return
        }

        if(password!==re_password){
            setError("Passwords didn't match")
            return
        }

        delete user.re_password
        
        await register(user)
    }

    return (
        <div>
            <form className="form sign-up" onSubmit={onSubmit}>
                <h2>Be a part of our Community,</h2>
                <label>
                  <span>User_Name</span>
                  <input 
                    name='name'
                    type='text'
                    value={name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  <span>Password</span>
                  <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  <span>Repeat Password</span>
                  <input 
                    name="re_password"
                    type="password"
                    value={re_password}
                    onChange={handleChange}
                    required
                  />
                </label>
                <button type="submit" className="submit">
                  Sign Up
                </button>
          </form>
        </div>
    )
}

export default Register
