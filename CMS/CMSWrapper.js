import React from 'react';
import App from './App';
import { useRouter } from 'next/router';
import { getApps, initializeApp } from '@firebase/app';
import { getFirestore } from 'firebase/firestore';
import { PROJECT_NAME } from '../constants';

const CMS_Freelance = dynamic(
    () => import('./CMS_Freelance'),
    {ssr: false}
);
  
const CMS = dynamic(
    () => import('./CMS.js'),
    {ssr: false}
);

/* Start of Firebase */

if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}
var db = getFirestore();
/* End of Firebase */

export default function CMSWrapper({
    children
}){
    const router = useRouter();

    return(
        <Router>
            {router.pathname === '/login'
                ? <CMS
                    projectName={PROJECT_NAME} 

                    children={
                        <App db={db} firebase={firebase} />
                    } 
                    db={db}
                    firebase={firebase}
                    collectionName="CMS"
                    collectionWebsiteContent="CMS_WebsiteContent" 
                />
                : <App db={db} firebase={firebase}/>
            }
        </Router>
    )
}
