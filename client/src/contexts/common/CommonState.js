import { useState , useEffect } from 'react'

import CommonContext from './CommonContext'

// import Accounts from '../../api/user_accounts/accounts'

import AxiosInstance from "../../utilsClient/AxiosInstance"


const CommonState = ({children})=>{
 
   const [ response , setResponse ] = useState(null)
   const [ error , setError ] = useState(null)
   const [ user , setUser ] = useState(null)
   const [activeLi, setActiveLi] = useState(0);

   const [ userPosts , setUserPosts ] = useState(null)

   const [ isLogged , setIsLogged ] = useState(
       false
   )

   const [ passwordModified , setPasswordModified ] = useState(false)

   const [ emailActivated , setEmailActivated ] = useState(-1)

   const [ userFollowers , setUserFollowers ] = useState(null)

   useEffect(async() => {

      setError(null)

      const res = await AxiosInstance.get('/user/isAuthenticated')

      if(res.data.success===1){
          setIsLogged(true)
          setUser(res.data.user)

          setUserFollowers(res.data.user.followers)

          return
      }

      setError('Authenticate to procced furthur!')
   }, [])

   const login = async (user)=>{
          
        setResponse(null)
        setError(null)
        setIsLogged(false)

        const config = {
            header: {
                "Content-Type": "application/json",
            },
        };
        const res = await AxiosInstance.post("/user/login", user, config)

        if(res.data.success===1){
            
            setResponse(res.data.msg)
            setUser(res.data.user)
            setIsLogged(true)
        }else{

            setError(res.data.msg)
        }
   }

   const register = async (user)=>{

        setResponse(null)
        setError(null)

        const config = {
            header: {
            'Content-Type': 'application/json'
            }
        }
        const res = await AxiosInstance.post( '/user/register' , user , config )
                
        if(res.data.success===1){
            setResponse(res.data.msg)

        }else{
            setError(res.data.msg)
        }
   }

   const forgetPassword = async (email)=>{

        setResponse(null)
        setError(null)

        const config = {
            header: {
            'Content-Type': 'application/json'
            }
        }
        const res = await AxiosInstance.post( '/user/forgetPassword' , {
            email
        } , config )
        
        if(res.data.success===1){
            setResponse(res.data.msg)
        }else{
            setError(res.data.msg)
        }
   }

   const updatePassword = async (access_token , newPassword )=>{

        setPasswordModified(false)
        
        const config = {
            header: {
            'Content-Type': 'application/json'
            }
        }

        const res = await AxiosInstance.patch( `/user/updatePassword/${access_token}` , {
            newPassword 
        } , config )

        if(res.data.success===1){

            setResponse(res.data.msg)
            setPasswordModified(true)
        }else{
            setError(res.data.msg)
        }
   }

   const logOut = async ()=>{
        const res = await AxiosInstance.get('/user/logout')
            
        if(res.data.success===1){
            setResponse(res.data.msg)
            setIsLogged(false)
            setUser(null)
        }else{
            setError(res.data.msg)
        }
   }

   const emailActivation = async (activationToken)=>{
    
    const res = await AxiosInstance.patch(`/user/activate/${activationToken}`)

    if(res.data.success === 1){
       setResponse(res.data.msg)
       setEmailActivated(1)

    }else{
        setError(res.data.msg)
        setEmailActivated(0)
    }
   }

   const getUserPosts = async ()=>{
    
    const res = await AxiosInstance.get("/user")
 
    console.log(res.data);

    if (res.data.success === 1) {
        setUser(res.data.user);
        setUserPosts(res.data.posts);
        return;
    }
        setError(res.data.msg);
   }

   return(
       <CommonContext.Provider
          value={{
              response,
              setResponse,
              error,
              setError,
              login,
              isLogged,
              register,
              forgetPassword,
              passwordModified,
              setPasswordModified,
              updatePassword,
              logOut,
              emailActivation,
              emailActivated,
              user,
              userFollowers , 
              setUserFollowers,
              setUserPosts,
              userPosts,
              getUserPosts,
            //   accounts:Accounts(),
             activeLi,
             setActiveLi
          }}
       >
           {children}
       </CommonContext.Provider>
   ) 
}

export default CommonState