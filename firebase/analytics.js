import { getAnalytics, logEvent as le } from "firebase/analytics";
import { APP_TITLE } from "../constants";

export const ANALYTICS_logEvent = (str, obj) => {
    
    const analytics = getAnalytics();

    if (!window.location.origin.includes('localhost:3000')) {
        if (!obj) obj = {};
        obj.website = APP_TITLE;
        le(analytics, str, obj);
    } else {
        console.error("Not logging analytics event due to localhost");
    }
}

export const ANALYTICS_screenView = (screenName, screenClass) => {
    
    const analytics = getAnalytics();

    if (!window.location.origin.includes('localhost:3000')) {
        le(analytics, 'screen_view', {
            firebase_screen: screenName,
            firbase_screen_class: screenClass,
            website: APP_TITLE,
        });
    } 
    else {
        console.error("Not logging analytics event due to localhost");
    }

}
