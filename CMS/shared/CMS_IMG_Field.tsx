import Image from 'next/image';
import {FC} from 'react';

interface ImgProps {
    id: string,
    websiteContent: any,
    alt: string,
    placeholder: any,
    c?: string,
    width?: number,
    height?: number,
    layout?: any,
    s?: any,
}

const CMS_IMG_Field: FC<ImgProps> = ({
    id,
    websiteContent,
    alt,
    placeholder,
    c,
    width,
    height,
    layout,
    s,
}) => {
    console.log("websiteContent[id]", websiteContent[id], placeholder);

    var imgSrc = websiteContent[id] ? websiteContent[id].url : placeholder || '/webbi logo.png';
    console.log("s", s);

    var img = 
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
