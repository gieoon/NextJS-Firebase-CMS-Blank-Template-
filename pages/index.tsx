import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import styles from '../styles/HomePage.module.scss'
import { GlobalContext } from '../context'
import {APP_ICON, PROJECT_NAME, SITE_URL, TWITTER_HANDLE} from '../constants';
import { collectionNameToUrl, getFieldName, loadDynamicData, loadDynamicDataSnapshot, loadFromPath, loadWebpageData, loadWebpageDataSnapshot } from '../CMS/helpers'
import Image from 'next/image';
import SearchBar from '../components/Searchbar'
import { createBrotliCompress } from 'zlib'
import StandardButton from '../components/shared/StandardButton'
import BasicModal from '../components/Dialog'
import Trip from '../models/Trip'

export default function IndexPage({
    websiteContent,
    activities,
    destinations,
    trips,
    languages,
    reviews,
}){
    const _websiteContent = JSON.parse(websiteContent);
    const _activities = JSON.parse(activities);
    const _trips = JSON.parse(trips);
    const _destinations = JSON.parse(destinations);
    const _languages = JSON.parse(languages);
    const _reviews = JSON.parse(reviews);

    const [isShowingPopup, setIsShowingPopup] = useState(false);
  
    const {
        setWebsiteContent,
        setActivities,
        setTrips,
        setDestinations,
        setLanguages,
        setReviews,
    } = useContext(GlobalContext);
    
    // console.log("_trips: ", trips);

    useEffect(() => {

        setWebsiteContent(_websiteContent);
        setActivities(_activities);
        setTrips(_trips);
        setDestinations(_destinations);
        setLanguages(_languages);
        setReviews(_reviews);

        // loadDynamicDataSnapshot(PROJECT_NAME, 'Activities', (a) => setActivities(a));
        // loadDynamicDataSnapshot(PROJECT_NAME, 'Trips', (t) => setTrips(t));
        // loadDynamicDataSnapshot(PROJECT_NAME, 'Destinations', (d) => setDestinations(d));
        // loadDynamicDataSnapshot(PROJECT_NAME, 'Languages', (l) => setLanguages(l));
        // loadWebpageDataSnapshot(PROJECT_NAME, (w) => setWebsiteContent(w));
        
    }, []);

    return (
        <div className={styles.HomePage}>
            <Head>
                <title>Tours around New Zealand, time to travel &amp; explore </title>
                <meta name="description" content="Make your next destination New Zealand. Explore the nature, go for amazing hikes, and immerse yourself in an authentic Kiwi experience. Choose a customized trip, join local activities, have an amazing time!" />
                <link rel="icon" href={APP_ICON} />

                <meta property="og:title" content={"Plan your trip to New Zealand | I Need Nature | Travel &amp; explore destinations"} />
                <meta property="og:description" content={"Make your next destination New Zealand. Explore the nature, go for amazing hikes, and immerse yourself in an authentic Kiwi experience. Choose a customized trip, join local activities, have an amazing time!"} />
                <meta property="og:url" content={SITE_URL} />
                <meta property="og:image" content={SITE_URL + '/thumbnail_1600.png'} />

                <meta name="twitter:card" content="summary" />
                <meta name="twitter:site" content={TWITTER_HANDLE} />
                <meta name="twitter:creator" content={TWITTER_HANDLE} />
            </Head>
            

            <div className={styles.header_row}>

                <img src="/images/camping-on-mountain.svg" className={styles.img2} />
                <img src="/images/bus-driver-with-mustache.svg" className={styles.img3} />

                <div className={styles.inner}>
                    {/* <Image src="/images/travel_header.avif" width="250" height="150"/> */}
                    <div>
                        <h2>Find a tour in New Zealand</h2>
                        <SearchBar />
                    </div>
                    {/* <img src="/images/travel3_transparent.png" /> */}
                    
                    <img src="/images/mountain-trekking.svg" />
                    {/* <object type="image/svg+xml" data="/images/onboarding.svg">svg-animation</object> */}

                </div>

                <div className={styles.bottom_content}>
                    <div className={styles.inner}>
                        <p>The best of New Zealand in one place</p>
                    </div>
                </div>
                
            </div>
            <main className={styles.main}>
                {/* <h2>Trips</h2> */}

                {/* Add in different sections. */}
                
                <div className="tiles">
                    { _trips.map((trip, i) => (
                        <div key={'tripcard-'+i} />
                    ))

                    }
                </div>
                
            
            </main>

            <div className={styles.want_more}>
                <div className={styles.inner}>

                    <h2>Want to see more?</h2>

                    <p>We try to keep our information up to date but let us know if you would like to recommend another.</p>

                    <BasicModal 
                        websiteContent={websiteContent}
                        buttonText=""
                        isOpen={isShowingPopup}
                        setIsOpen={setIsShowingPopup}
                        showTripsDropdown={false}
                    />

                    <StandardButton 
                        text={'Request a tour'}
                        cb={() => setIsShowingPopup(true)}
                        isCta={true}
                        isMaxWidth={false}
                        leftAlign={true}
                    />

                </div>
            </div>

        </div>
    )
}



// export async function getStaticPaths() {
    
//     const loadActivities = async () => {
//         return await loadDynamicData(PROJECT_NAME, 'Activities');
//     }

//     const activityNames = await loadActivities()
//         .then((activities) =>   
//             activities.map(aName => {
                
//                 // console.log('static paths projectName: ', pName);
//                 return { params: { activityName: collectionNameToUrl(aName.title) }, };
//             })
//         );
    
//     // console.log("static paths projectNames: ", projectNames);

//     return {
//         paths: activityNames,
//         fallback: true,
//     }
// }

export async function getStaticProps(context) {

    const websiteContent = await loadWebpageData(PROJECT_NAME);
    var activities = await loadDynamicData(PROJECT_NAME, 'Activities');
    var destinations = await loadDynamicData(PROJECT_NAME, 'Destinations');
    var trips = await loadDynamicData(PROJECT_NAME, 'Trips');
    var languages = await loadDynamicData(PROJECT_NAME, 'Languages');
    var reviews = await loadDynamicData(PROJECT_NAME, 'Reviews');

    const memoizedDestinations = {};
    const memoizedActivities = {};
    const memoizedItineraryDays = {};
    const memoizedReviews = {};
    const memoizedSupportedLanguages = {};
    // for (var d of destinations) {
    //     memoizedDestinations[d.path] = 
    // }

    for (var i in trips) {
        // For now, memoized data is initialized as empty.
        trips[i] = await Trip.init(trips[i],
            memoizedItineraryDays,
            memoizedSupportedLanguages,
            memoizedActivities,
            memoizedDestinations,
            memoizedReviews
        );

        // console.log("PARENT memoizedItineraryDays: ", Object.keys(memoizedItineraryDays).length);
    }

    return {
        props: {
            activities: JSON.stringify(activities),
            destinations: JSON.stringify(destinations),
            trips: JSON.stringify(trips),
            languages: JSON.stringify(languages),
            reviews: JSON.stringify(reviews),
            websiteContent: JSON.stringify(websiteContent),
        },
        revalidate: 1440,
    }

}