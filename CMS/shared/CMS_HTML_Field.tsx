import { FC, ReactElement, useContext } from "react"
import { GlobalContext } from "../../context";

interface HTMLProps {
    id: string,
    c?: string,
    placeholder: string, //ReactElement,
}
const CMS_HTML_Field: FC<HTMLProps> = ({id, placeholder, c}) => {

    const {websiteContent} = useContext(GlobalContext);

    return <div id={id} className={"cp-editable " + c} dangerouslySetInnerHTML={{ 
        __html: websiteContent[id] ? websiteContent[id] : placeholder
    }} />
}

export default CMS_HTML_Field;
