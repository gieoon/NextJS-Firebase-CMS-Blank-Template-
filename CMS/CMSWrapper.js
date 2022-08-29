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


const firebaseConfig = {
  apiKey: "AIzaSyBiw4ORAbMmxImx4qPGq9JAFtUI36PeYQ0",
  authDomain: "sheets2website-1598313088115.firebaseapp.com",
  databaseURL: "https://sheets2website-1598313088115.firebaseio.com",
  projectId: "sheets2website-1598313088115",
  storageBucket: "sheets2website-1598313088115.appspot.com",
  messagingSenderId: "1082271392691",
  appId: "1:1082271392691:web:45c06be046a0a72b5b21c6",
  measurementId: "G-ZWGE5NLZ4Z"
};

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