import React,{useState , useEffect,useContext} from 'react'

import QuillEditor from '../editor/quill_editor'

import '../../css/add_post/add_post.css'

import CommonContext from '../../contexts/common/CommonContext'

import ImageSlider from "../imageSlider/imageSlider"

import AxiosInstance from '../../utilsClient/AxiosInstance'

import queryString from 'query-string'

const Home = ({location}) => {

    const { setError , setResponse , setUserPosts, userPosts } = useContext(CommonContext)

    const [ editorHtml , setEditorHtml ] = useState('')
    const [ title , setTitle ] = useState('')
    const [ images, setImages ] = useState([])
    const [ file , setFile ] = useState(null)

    const [ IMAGES , SET_IMAGES ] = useState([])

    const [ category , setCategory ] = useState(1)

    const { editId } = queryString.parse(location.search)

    const [ postType , setPostType ] = useState(null)

    useEffect(async () => {
         
        if(editId){
             const res = await AxiosInstance.get(`/post/${editId}`)

             console.log(res.data)

             if(res.data.success){
                
                setCategory(res.data.post.postType)
                setTitle(res.data.post.title)
                setEditorHtml(res.data.post.description)

                setPostType(res.data.post.postType)

                setImages(res.data.post.images)
             }else{
                 setError(res.data.msg)
             }
        }
    }, [editId])

    const AddImages = ()=>{

        setResponse(null)
        setError(null)

        if(!file){
            return setError('No files choosen')
        }

        if(!(file.type==='image/jpg'|| file.type==='image/jpeg'||file.type==='image/png'||file.type==='image/PNG'
                ||file.type==='image/JPG'||file.type==='image/JPEG')){

            return setError('Error : Prefer uploading an image!')
        }

        if(file.size>4000000){

            return setError('Error : File size should be less than 4MB')
        }

        setImages([ ...images  , URL.createObjectURL(file)])
        SET_IMAGES([ ...IMAGES , file ])
        setFile(null)

        setResponse('Image Added')
    }

    const onSubmit = async (e)=>{
        e.preventDefault()

        setResponse(null)
        setError(null)

        const formData = new FormData();

        formData.append('title',title)

        formData.append('description',editorHtml)

        formData.append('postType', 1-parseInt(category))

        IMAGES.map((img)=>{
            formData.append('images',img)
        })

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

       let res

        if(editId){
            res = await AxiosInstance.patch(`/post/${editId}`,formData,config)
        }else{
            res = await AxiosInstance.post('/post',formData,config)
        }
        
        console.log(res.data)

        if(res.data.success===1){
            setResponse(res.data.msg)
        }else{
            setError(res.data.msg)
        }
    }

    const activeLiColor = {
        backgroundColor: "rgba(9, 164, 253, 0.527)",
        color:"white"
    }

    const inActiveColor = {
        backgroundColor: "white",
        color:"grey"
    }

    return (
        <div className="add_post_container">

            {
                !editId
                ? <nav className="nav_add"> 
                <ul className="ul_add">
                    <li className="li_add" 
                       style={ category===1 ? activeLiColor : inActiveColor }
                       onClick={ ()=>setCategory(1) }
                    >Post</li>
                    <li className="li_add"
                       style={ category===2 ? activeLiColor : inActiveColor }
                       onClick={ ()=>setCategory(2) }
                    >Doubt</li>
                </ul>
            </nav>
            : null
            }

            <form onSubmit={onSubmit} >
                
                <h2 style={{textAlign:"center",marginBottom:'1rem',marginTop:'15vh'}}>
                    { 
                       editId ?
                          postType===0 ? "Edit Post" : "Edit Doubt"
                        : category===1 ? "New Post" : "New Doubt"
                    }
                </h2>
                
                <div className="title">
                    <input 
                        type="text"
                        placeholder="Enter Title"
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                        required
                    />
                </div>

                <QuillEditor editorHtml={editorHtml} setEditorHtml={setEditorHtml}/>

               {
                   editId ?
                     null :
                    <div className="filesAdded">
                        <input 
                            type="file"
                            name='file1'
                            onChange = {(e)=>setFile(e.target.files[0])}
                        />
                        
                        <input
                            onClick = {AddImages}
                            className="buttonStyle"
                            style={{background:' #90ee90',textAlign:'center'}}
                            value='Add Image'
                        />
                    </div>
               }

                <ImageSlider images={images} type={
                    editId ? 2 : 1
                }/>
                
                <button type="submit" className="submitBtn buttonStyle">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default Home