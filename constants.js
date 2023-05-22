import { addDoc, collection, getFirestore } from "@firebase/firestore";

export const PROJECT_NAME = 'test';
export const APP_TITLE = "";
export const APP_ICON = ''; // favicon_white.png
export const SITE_URL = '';
export const TWITTER_HANDLE = '@myaccount';

// Template ID is set in SendGrid and accepts substitution variables
export const EMAIL_API_SERVER = '';
export const SUPPORT_EMAIL = '...@gmail.com';
export const API_URL = '/'


export const cmsTemplates = {
    // uniqueArray: [
    //     {
    //       type: "span",
    //       value: "title"
    //     },
    // ]
}

export const sendData = (obj, cb, retryCount) => {
//     console.log('SENDING EMAIL');
    if(!retryCount) retryCount = 0;

    var replyEmail = obj.filter(f => f.field === "Email address")[0].value;
    var replyName = obj.filter(f => f.field === "Full name" || f.field === "First name")[0].value;
    // console.log("tripName: ", tripName, ', replyName: ', replyName, ', obj: ', obj);
    
    var subject = APP_TITLE + " Enquiry";
    // console.log("replyEmail: ", replyEmail);
    // console.log("replyName: ", replyName);

    fetch(EMAIL_API_SERVER,{
        method: 'POST',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            subject: subject,
            template_id: "d-ccc0a35ff1a5475199be661c43293995",
            destination_name: '',
            destination_email: SUPPORT_EMAIL,
            title: "You Received A web enquiry",
            items: obj,
            from_name: "",
            from_address: "no-reply@example.com",
            reply_email: replyEmail,
            reply_subject: "",
            reply_body: "Hi " + replyName + ", thank you for your enquiry.",
        })
    })
 
    .then((response) => {
        console.log("RESPONSE STATUS: ", response.status);

        //Resend if status is not 200.
        // TESTING
        if(response.status !== 200 && retryCount < 2){
            console.log('RESENDING AFTER FAIL');
            sendData(obj, cb, ++retryCount);
        }
        else if(retryCount === 2){
            // Log failure message to DB with all of the data.
            logErrorEmail({...obj, business: 'Error collection', handled: false});
        }
        // console.log(response.text());

        if(response.status === 200){
            cb();
        }
    });

}

const logErrorEmail = async (obj) => {
    console.log('Sending error email');
    addDoc(collection(getFirestore(), 'Email_Errors'), obj)
        .then((doc)=>{
            console.log('Added new error email: ', doc.id);
        })
        .catch(err => {
            console.error("Couldn't send email to admin: ", err);
        });
}
