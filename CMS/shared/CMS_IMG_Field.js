export default function CMS_IMG_Field({
    id,
    websiteContent,
    alt,
    placeholder,
    c,
}) {
    console.log("websiteContent[id]", websiteContent[id]);
    
    return (
        <img src={websiteContent[id] || placeholder} id={id} className={"cp-editable-img " + c} alt={alt} />
    );
}