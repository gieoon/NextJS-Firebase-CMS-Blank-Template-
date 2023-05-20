import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useContext } from 'react'
import styles from '../styles/AboutPage.module.scss'
import { GlobalContext } from '../context'
import { APP_ICON, SITE_URL, TWITTER_HANDLE } from '../constants'
import CMS_HTML_Field from '../CMS/shared/CMS_HTML_Field';
import CMS_String_Field from '../CMS/shared/CMS_String_Field';

const AboutPage: NextPage = () => {
  
  const {websiteContent} = useContext(GlobalContext);

  return (
    <div className={styles.container}>
      <Head>
          <title>About Page</title>
          <meta name="description" content="" />
          <link rel="icon" href={APP_ICON} />

          <meta property="og:title" content={""} />
          <meta property="og:description" content={""} />
          <meta property="og:url" content={SITE_URL} />
          <meta property="og:image" content={SITE_URL + '/thumbnail_1600.png'} />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content={TWITTER_HANDLE} />
          <meta name="twitter:creator" content={TWITTER_HANDLE} />
      </Head>

      <main className={styles.main}>
        
        <CMS_String_Field id="aboutPageTitle" 
          placeholder=""
          c={''}/>
        <CMS_HTML_Field id="aboutPageDesc" c="" 
          placeholder={''} />
        
        
      </main>

    </div>
  )
}

export default AboutPage;
