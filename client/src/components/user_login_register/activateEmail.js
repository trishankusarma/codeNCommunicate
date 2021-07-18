import { useEffect, useContext  } from 'react'

import { useParams , useHistory } from 'react-router-dom'

import '../../css/email_Activation/email_Activation.css'

import CommonContext from '../../contexts/common/CommonContext'

const ActivateEmail = () => {

    const history = useHistory()

    const { activationToken } = useParams()

    const { emailActivated , emailActivation , error , response } = useContext(CommonContext)

    useEffect(async()=>{

        await emailActivation(activationToken)

        if(emailActivated===1){

            setTimeout(()=>{
                history.push('/')
            },2000)
        }
    },[])  

    return (
      <>
         
        <div className="email_Activated">
               {
                   emailActivated===-1 ?
                      <h1>Loading</h1> :
                      emailActivated===1 ?
                      <div>
                          <div className="icon-holder tick"><i className="fa fa-check" aria-hidden="true"></i></div>
                          <div className="heading">{response}</div>
                          <div className="sub-heading">You can access our community.</div>
                      </div>
                      :
                      <div>
                           <div className="icon-holder cross"><i className="fa fa-times" aria-hidden="true"></i></div>
                           <div className="heading">Error</div>
                           <div className="sub-heading">{error} </div>
                      </div>
                      
               }
         </div>
      </>
    )
}

export default ActivateEmail
