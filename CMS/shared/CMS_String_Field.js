export default function CMS_String_Field({
    id, 
    websiteContent, 
    placeholder,
    c,
}) {
    return <p 
        id={id} 
        className={"cp-editable " + c}>{
            websiteContent[id] 
                ? websiteContent[id] 
                : placeholder
        }</p>
}
