import { useState , useContext , useEffect } from 'react'

import CommonContext from '../../contexts/common/CommonContext'

import '../../css/password_reset/password_Reset.css'

const  ForgetPass = () => {

    const { forgetPassword , setError ,setResponse } = useContext(CommonContext)

    const [ email , setEmail ] = useState('') 

    useEffect(()=>{
        setResponse(null)
        setError(null)
    },[])

    const handleChange = (e)=>{
        setEmail(e.target.value)
    }

    const onSubmit = async (e)=>{
        e.preventDefault();
        
        await forgetPassword(email)
    }

    return (
        <div>
            <div className='password_reset' style={{width:'30vw'}}>

                <h1 className="heading">Forget Password</h1>

                <form onSubmit={onSubmit} className="form_data" >

                    <div className="form-group">
                        <input
                                name='email'
                                type='email'
                                value={email}
                                placeholder='Enter Email'
                                onChange={handleChange}
                                className="form-control"
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

export default ForgetPass
