export default function CMS_String_Field({id, websiteContent}) {
    return <div id={id} className="cp-editable">{websiteContent[id]}</div>
}
