export default function CMS_HTML_Field({id, websiteContent}) {
    return <div id={id} className="cp-editable" dangerouslySetInnerHTML={{ 
        __html: websiteContent[id] 
    }} />
}
