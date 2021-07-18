import ToastUtils from './ToastUtils'
import { useContext } from 'react'
import CommonContext from '../.../../../contexts/common/CommonContext'

const Toast = ()=>{

    const { response, error } = useContext(CommonContext)

    return(
      <div>
        { 
              response !== null ?
                      <ToastUtils classIs="toast_msg_success" msg={response}/>
                      : error !== null ?
                      <ToastUtils classIs="toast_msg_error" msg={error}/>
                      : null
        }
      </div>
    )
}

export default Toast