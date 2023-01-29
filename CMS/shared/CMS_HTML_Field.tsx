import { FC, ReactElement } from "react"

interface HTMLProps {
    id: string,
    c?: string,
    websiteContent: any,
    placeholder: string, //ReactElement,
}
const CMS_HTML_Field: FC<HTMLProps> = ({id, websiteContent, placeholder}) => {

    return <div id={id} className="cp-editable" dangerouslySetInnerHTML={{ 
        __html: websiteContent[id] ? websiteContent[id] : placeholder
    }} />
}

export default CMS_HTML_Field;
