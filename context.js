import { createContext, useEffect, useState } from "react";
import { loadDynamicData, loadDynamicDataSnapshot, loadWebpageDataSnapshot } from "./CMS/helpers";
import { PROJECT_NAME } from "./constants";

export const GlobalContext = createContext();

function GlobalContextProvider(props) {
    
    // The static Page Content with structure hardcoded via React.
    const [websiteContent, setWebsiteContent] = useState({});
    const [isHamburgerActive, setIsHamburgerActive] = useState(false);
    
    // Dynamic content. 
    const [dynamicList, setDynamicList] = useState([]);

    // Listen to changes in the DB as well, after static pre-rendering.

    useEffect(() => {
        
        // Load dynamic content here if it needs to be refreshed.
//         loadDynamicDataSnapshot(PROJECT_NAME, 'DynamicListCollectionName', (t) => setDynamicList(t));
        loadWebpageDataSnapshot(PROJECT_NAME, (w) => setWebsiteContent(w));
        
        // Loading spreadsheet data that has been saved into CMS via Appscript + Firebase Service Account.
        // ./saveToFirestore.appscript
//         loadSpreadsheetDataFIRESTORE('events').then(d => {
            
//             d = d.map(dd => {
//                 return {
//                     topic: dd.topic,
//                     speaker: dd.speaker,
//                     date: new Date(dd.date.seconds * 1000),
//                 }
//             })
//             // console.log('spreadsheet data firestore', d)
//             setEvents(d);
//         })
        
    }, []);

    return (
        <GlobalContext.Provider value={{
            websiteContent: websiteContent,
            setWebsiteContent: setWebsiteContent,
            isHamburgerActive: isHamburgerActive,
            setIsHamburgerActive: setIsHamburgerActive,
            dynamicList: dynamicList,
            setDynamicList: setDynamicList,
        }}>
            {props.children}
        </GlobalContext.Provider>
    );
}

export default GlobalContextProvider;
