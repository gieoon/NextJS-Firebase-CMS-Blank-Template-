import { createContext, useEffect, useState } from "react";
import { loadDynamicData, loadDynamicDataSnapshot, loadWebpageDataSnapshot } from "./CMS/helpers";
import { PROJECT_NAME } from "./constants";

export const GlobalContext = createContext();

function GlobalContextProvider(props) {
    
    const [websiteContent, setWebsiteContent] = useState({});
    const [trips, setTrips] = useState([]);
    const [activities, setActivities] = useState([]);
    const [searchTerm, setSearchTerm] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [currentTrip, setCurrentTrip] = useState({});

    // Listen to changes in the DB as well, after static pre-rendering.

    useEffect(() => {
        
        loadDynamicDataSnapshot(PROJECT_NAME, 'Activities', (a) => setActivities(a));
        loadDynamicDataSnapshot(PROJECT_NAME, 'Trips', (t) => setTrips(t));
        loadDynamicDataSnapshot(PROJECT_NAME, 'Destinations', (d) => setDestinations(d));
        loadDynamicDataSnapshot(PROJECT_NAME, 'Languages', (l) => setLanguages(l));
        loadDynamicDataSnapshot(PROJECT_NAME, 'Reviews', (r) => setReviews(r));
        loadWebpageDataSnapshot(PROJECT_NAME, (w) => setWebsiteContent(w));
        
    }, []);

    return (
        <GlobalContext.Provider value={{
            websiteContent: websiteContent,
            setWebsiteContent: setWebsiteContent,
            trips: trips,
            setTrips: setTrips,
            searchTerm: searchTerm,
            setSearchTerm: setSearchTerm,
            destinations: destinations,
            setDestinations: setDestinations,
            activities: activities,
            setActivities: setActivities,
            languages: languages,
            setLanguages: setLanguages,
            reviews: reviews,
            setReviews: setReviews,
            currentTrip: currentTrip,
            setCurrentTrip: setCurrentTrip,
        }}>
            {props.children}
        </GlobalContext.Provider>
    );
}

export default GlobalContextProvider;