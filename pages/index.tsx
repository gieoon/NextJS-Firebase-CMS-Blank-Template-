import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import styles from '../styles/HomePage.module.scss'
import { GlobalContext } from '../context'
import {APP_ICON, PROJECT_NAME, SITE_URL, TWITTER_HANDLE} from '../constants';
import { collectionNameToUrl, getFieldName, loadDynamicData, loadDynamicDataSnapshot, loadFromPath, loadWebpageData, loadWebpageDataSnapshot } from '../CMS/helpers'
import Image from 'next/image';
import SearchBar from '../components/Searchbar'
import StandardButton from '../components/shared/StandardButton'
import BasicModal from '../components/Dialog'
import CMS_String_Field from '../CMS/shared/CMS_String_Field'
import DynamicList from '../models/DynamicList'

export default function IndexPage({
    websiteContent,
    dynamicList,
}){
    const _websiteContent = JSON.parse(websiteContent);
    const _dynamicList = JSON.parse(dynamicList);

    const [isShowingPopup, setIsShowingPopup] = useState(false);
  
    const {
        setWebsiteContent,
        setDynamicList,
    } = useContext(GlobalContext);
    
    // console.log("_trips: ", trips);

    useEffect(() => {

        setWebsiteContent(_websiteContent);
        setDynamicList(_dynamicList);

        // loadDynamicDataSnapshot(PROJECT_NAME, 'DynamicListCollectionName', (d) => setDynamicList(d));
        // loadWebpageDataSnapshot(PROJECT_NAME, (w) => setWebsiteContent(w));
        
    }, []);

    const metaTitle = 'Hello World';
    const metaDescription = 'Hello World, but with a longer description.'

    return (
        <div className={styles.HomePage}>
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
                <link rel="icon" href={APP_ICON} />

                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:url" content={SITE_URL} />
                <meta property="og:image" content={SITE_URL + '/thumbnail_1600.png'} />

                <meta name="twitter:card" content="summary" />
                <meta name="twitter:site" content={TWITTER_HANDLE} />
                <meta name="twitter:creator" content={TWITTER_HANDLE} />
            </Head>
            

            <div className={styles.header_row}>

                <div className={styles.inner}>
                    {/* <Image src="/images/travel_header.avif" width="250" height="150"/> */}
                    <div>
                        <CMS_String_Field 
                            id="homePageTitleField" // Unique Id
                            placeholder="CMS Content Title Field (Unedited)"
                            c={styles.special_class} // Use a special modularized className
                        />
                        <SearchBar />
                    </div>
                    
                    {/* NextJS doesn't like raw images, but you can disable the eslint checker and make this work */}
                    <img src="/images/mountain-trekking.svg" /> 

                </div>

                <div className={styles.bottom_content}>
                    <div className={styles.inner}>
                        <CMS_String_Field 
                            id="homePageField2" // Unique Id (again)
                            placeholder="Another CMS Content Field (Unedited)"
                            c={styles.special_class2}
                        />
                    </div>
                </div>
                
            </div>
            <main className={styles.main}>
                
                <div className="tiles">
                    { _dynamicList.map((data, i) => (
                        <div key={'dynamiclist-'+i} />
                    ))

                    }
                </div>
                
            
            </main>

            <div className={styles.want_more}>
                <div className={styles.inner}>


                    <h2>Raw headers like this will work</h2>

                    <p>But they can't be edited from the <a href='/login'>/login</a> page.</p>

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

// Below formatting is NextJS stuff. Learn about Next.JS directly to get involved.

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
    var dynamicList = await loadDynamicData(PROJECT_NAME, 'DynamicListCollectionName');

    // Can use memoized values if data loading is shared.
    const memoizedData = {};

    // Initialize each model class to transform the data.
    for (var i in dynamicList) {
        // For now, memoized data is initialized as empty.
        dynamicList[i] = await DynamicList.init(dynamicList[i],
            memoizedData,
        );

        // console.log("PARENT memoizedItineraryDays: ", Object.keys(memoizedItineraryDays).length);
    }

    return {
        props: {
            dynamicList: JSON.stringify(dynamicList),
            websiteContent: JSON.stringify(websiteContent),
        },
        revalidate: 1440,
    }

}