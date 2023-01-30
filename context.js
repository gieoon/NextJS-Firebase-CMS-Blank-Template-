import { createContext, useEffect, useState } from "react";
import { loadDynamicData, loadDynamicDataSnapshot, loadWebpageDataSnapshot } from "./CMS/helpers";
import { PROJECT_NAME } from "./constants";

export const GlobalContext = createContext();

function GlobalContextProvider(props) {
    
    const [websiteContent, setWebsiteContent] = useState({});
    const [trips, setTrips] = useState([]);

    // Listen to changes in the DB as well, after static pre-rendering.

    useEffect(() => {
        
//         loadDynamicDataSnapshot(PROJECT_NAME, 'Trips', (t) => setTrips(t));
        loadWebpageDataSnapshot(PROJECT_NAME, (w) => setWebsiteContent(w));
        
    }, []);

    return (
        <GlobalContext.Provider value={{
            websiteContent: websiteContent,
            setWebsiteContent: setWebsiteContent,
            trips: trips,
            setTrips: setTrips,
        }}>
            {props.children}
        </GlobalContext.Provider>
    );
}

export default GlobalContextProvider;
