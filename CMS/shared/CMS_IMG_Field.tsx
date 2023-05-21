import Image from 'next/image';
import {FC, useContext } from 'react';
import { GlobalContext } from '../../context';

interface ImgProps {
    id: string,
    alt: string,
    placeholder: any,
    c?: string,
    width?: number,
    height?: number,
    layout?: any,
    s?: any,
    isNatural?: boolean,
}

const CMS_IMG_Field: FC<ImgProps> = ({
    id,
    alt,
    placeholder,
    c,
    width,
    height,
    layout,
    s,
    isNatural,
}) => {
    console.log("websiteContent[id]", websiteContent[id], placeholder);
    
    const {websiteContent} = useContext(GlobalContext);
    
    var fileObj = websiteContent[id];

    var imgSrc = websiteContent[id] ? websiteContent[id].url : placeholder || '/webbi logo.png';
    console.log("s", s);
    
    if (!imgSrc || typeof(imgSrc) === 'object') {
        imgSrc = '/webbi logo.png';
    }
    
    var img;
    if (fileObj && Object.keys(fileObj).length && fileObj.fileType && fileObj.fileType.includes('video')) {
        img =  <video width={width} height={height} controls={false} autoPlay={true} muted={true} loop={true}
            style={s}    
            className={'cp-editable-img ' + c}
            id={id}>
            <source src={imgSrc} type="video/mp4" />
        </video>;
    } 
    else {    
        img = 
        // <img src={websiteContent[id] ? websiteContent[id].url : placeholder} id={id} className={"cp-editable-img " + c} alt={alt} />
        <Image src={imgSrc} 
            style={s}
            id={id}
            className={"cp-editable-img " + c} 
            alt={alt}
            width={width}
            height={height}
            layout={layout}
            blurDataURL={imgSrc}
            placeholder="blur" />
    }
    
   if (isNatural) {
        return <img 
            src={websiteContent[id] 
                ? websiteContent[id].url : placeholder} 
            id={id} 
            className={"cp-editable-img " + c} 
            alt={alt} />
    }
        
    if (layout === 'fill') {
        return (
            <div> 
                {/* style={{position: 'relative'}}> */}
                {img}
            </div>
        )
    }
    else {
        return img;
    }
}

export default CMS_IMG_Field;
