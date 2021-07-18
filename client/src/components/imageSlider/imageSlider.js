import React, { useState } from "react";
import {FaArrowAltCircleRight,FaArrowAltCircleLeft} from 'react-icons/fa';

import './imageSlider.css'

const ImageSlider = ({ images, type })=> {
    
    const [curr,setCurr]=useState(0);
    const length = images.length;

    const nextSlide=()=>{
        setCurr(curr===length-1?0:curr+1)
    }
    const prevSlide=()=>{
        setCurr(curr===0?length-1:curr-1)
    }

    if(!Array.isArray(images) || (images.length)<=0){
            return null;
    }

    const arrayBufferToBase64 = (buffer)=>{

        var binary = '';
     
        var bytes = [].slice.call(new Uint8Array(buffer));
     
        bytes.forEach((b) => binary += String.fromCharCode(b));
     
        return window.btoa(binary);
    };

    const setImageUrl = (owner)=>{

        const base64Flag = `data:${owner.imageType};base64,`;
           
        const imageStr = arrayBufferToBase64(owner.image.data);

        return  base64Flag + imageStr ;
    }
    
    return (
        <section className="slider">
            <FaArrowAltCircleLeft className="left-arrow" onClick={prevSlide}/>
            <FaArrowAltCircleRight className="right-arrow" onClick={nextSlide}/>
            
                {  images && images.map((img, index) => (

                    <div className={index===curr?"slide active":"slide"} key={index}>
                        {
                            index===curr && (
                                type===1 ?
                                    <div>
                                        <img src={img} alt="user images" className="image"/> 
                                    </div>
                                :
                                    <div>
                                        <img src={setImageUrl(img)} alt="user images" className="image"/> 
                                    </div>
                            )
                        }
                    </div>
                ))}
        </section>
    );
}

export default ImageSlider;