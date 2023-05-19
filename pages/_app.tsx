import '../styles/globals.css';
import '../styles/hamburger.css';
import '../CMS/cms_globals.css';
import type { AppProps } from 'next/app'
import React, { createContext, useEffect, useState } from 'react'
import FloatingHeader from '../components/FloatingHeader';
import Footer from '../components/Footer';
import Header from '../components/Header';
import FullScreenMenu from '../components/FullScreenMenu';
import GlobalContextProvider from '../context';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Head from 'next/head';
import '../firebase/firebase';
import { APP_ICON, cmsTemplates, PROJECT_NAME } from '../constants';
import PageTransition from '../components/PageTransition';
import Link from 'next/link';

const CMS_Freelance = dynamic(
  () => import('../CMS/CMS_Freelance'),
  {ssr: false}
);

const CMS = dynamic(
  () => import('../CMS/CMS.js'),
  {ssr: false}
);

const isElementInViewport = (el: any) => {

  var rect = el.getBoundingClientRect();

  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [isFloatingHeaderVisible, setIsFloatingHeaderVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = window.onscroll = () => {
      if (window.scrollY > 500) {
        if(!isFloatingHeaderVisible) setIsFloatingHeaderVisible(true);
      }
      else if (window.scrollY < 500) {
        if (isFloatingHeaderVisible) setIsFloatingHeaderVisible(false);
      }

      const superButtons = Array.from(document.querySelectorAll(".super_button"));
      superButtons.forEach(elem => {
        var isInView = isElementInViewport(elem);
        // console.log(isInView);
        elem.classList.toggle('visible', isInView);
      });

      const fadeIns = Array.from(document.querySelectorAll(".fade_in"));
      fadeIns.forEach(elem => {
        var isInView = isElementInViewport(elem);
        elem.classList.toggle("visible", isInView);
      })
    }

    return unsubscribe();
  })

  const defaultMetaTitle = "Change your website's title";
  const defaultMetaDescription = "This is your website's description";

  return <PageTransition>

      <GlobalContextProvider>
      
      <Head>
          <title>{defaultMetaTitle}</title>
          <meta name="description" content={defaultMetaDescription} />
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link rel="icon" href={APP_ICON} />
      </Head>

      { router.pathname === '/login'
        ? <div>

          <CMS_Freelance projectName={PROJECT_NAME} />

        </div>
        : <>

          <CMS allowedOrigins={["ineednature.co.nz", "example.co.nz", "localhost:3000"]}
              templates={cmsTemplates} />
      
          <Header />

          <Component {...pageProps}  />

          <Footer />

          <FloatingHeader isVisible={isFloatingHeaderVisible} />

          <FullScreenMenu />
        </>
      }
    </GlobalContextProvider>
    
  </PageTransition>
}

export default MyApp
