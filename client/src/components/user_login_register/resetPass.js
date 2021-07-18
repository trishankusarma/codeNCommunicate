import { useState , useEffect , useContext } from 'react'

import { useParams , useHistory } from 'react-router-dom'

import CommonContext from '../../contexts/common/CommonContext'

import '../../css/password_reset/password_Reset.css'

const ResetPass = () => {
    
    const { access_token } = useParams()

    const history = useHistory()

    const { updatePassword , setError ,setResponse , passwordModified , setPasswordModified } = useContext(CommonContext)

    useEffect(()=>{

        setError(null)
        setResponse(null)
        setPasswordModified(false)
    },[])

    const [ passwords , setPasswords ] = useState({
        newPassword:'',
        repeatPassword:''
    })

    const { newPassword , repeatPassword } = passwords

    const handleChange = (e)=>{
        setPasswords({
            ...passwords,
            [e.target.name] : e.target.value
        })
    }

    const onSubmit = async (e)=>{
        e.preventDefault();

        if(newPassword.length < 6){
            setError('Password Length should be atleast 6!')
            return;
        }

        if( newPassword !== repeatPassword ){
            setError('Passwords must be same!')
            return
        }

        await updatePassword(access_token , newPassword )
    }

    useEffect(()=>{
        if(passwordModified){
           
          setTimeout(()=>{
             history.push('/')     
          },2000)
        }
    },[passwordModified])

    return (
        <div>
            <div className="password_reset">

                <h1 className="heading">Reset your password?</h1>


                <form className="form_data" onSubmit={onSubmit}>

                    <div className="form-group">
                        <input
                            name='newPassword'
                            type='password'
                            value={newPassword}
                            placeholder='New Password'
                            onChange={handleChange}
                            className="form-control"
                            placeholder="New Password"
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <input
                            name='repeatPassword'
                            type='password'
                            value={repeatPassword}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Confirm Password"
                            required
                        />
                    </div>

                    <div className="form-group mt-4">
                        <input
                            type="submit"
                            className="form-control btn btn-success"
                            value="Submit"
                        />
                    </div>
                </form>
            </div>
       </div>
    )
}

export default ResetPass
