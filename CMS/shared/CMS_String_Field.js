import { useContext } from "react"
import { GlobalContext } from "../../context"

export default function CMS_String_Field({
    id, // Unique ID (Firestore document object key)
    placeholder, // Default text
    c, // Custom className
    style, // Object
}) {
    
    const {websiteContent} = useContext(GlobalContext);

    return <p 
        id={id} 
        style={style}
        className={"cp-editable " + c}>{
            websiteContent[id] 
                ? websiteContent[id] 
                : placeholder
        }</p>
}
