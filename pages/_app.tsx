import '../styles/globals.css'
import '../CMS/cms_globals.css';
import type { AppProps } from 'next/app'
import React, { createContext, useEffect, useState } from 'react'
import FloatingHeader from '../components/FloatingHeader';
import Footer from '../components/Footer';
import Header from '../components/Header';
import GlobalContextProvider from '../context';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Head from 'next/head';
import '../firebase/firebase';
import { APP_ICON } from '../constants';

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

  return <GlobalContextProvider>
    
    <Head>
        <title>Do I Really Need Nature?</title>
        <meta name="description" content="Do I really need nature?" />
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href={APP_ICON} />
    </Head>

    { router.pathname === '/login'
      ? <div>

        <CMS_Freelance projectName="i_need_nature" />

      </div>
      : <>

        <CMS allowedOrigins={["ineednature.co.nz","localhost:3000"]}
            templates={[]/*cmsTemplates*/} />
    
        <Header />

        <Component {...pageProps}  />

        <Footer />

        <FloatingHeader isVisible={isFloatingHeaderVisible} />
      </>
    }
  </GlobalContextProvider>
}

export default MyApp
