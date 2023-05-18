import { useContext } from "react"
import { GlobalContext } from "../../context"

export default function CMS_String_Field({
    id, 
    placeholder,
    c,
}) {
    
    const {websiteContent} = useContext(GlobalContext);

    return <p 
        id={id} 
        className={"cp-editable " + c}>{
            websiteContent[id] 
                ? websiteContent[id] 
                : placeholder
        }</p>
}
