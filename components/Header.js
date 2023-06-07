import styles from '../styles/Header.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState } from 'react';
import BasicModal from './Dialog';
import { GlobalContext } from '../context';
import { ANALYTICS_logEvent } from '../firebase/analytics';
import { APP_TITLE } from '../constants';

export default function Header() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const {websiteContent, isHamburgerActive, setIsHamburgerActive} = useContext(GlobalContext);

    return (
        <div className={styles.Header}>
            
            <Link href="/" className={styles.home_link} scroll={false}>
                <a>
                    <div className={styles.logo_container}>
                        {/* <Image src="/logo_transparent.png" 
                            width="165" 
                            height="61"
                        /> */}
                        <img src="/logo_transparent.png" style={{
                            width: '135px',
                            marginLeft: '-10px'
                        }} />
                        <div>
                            <h6>{APP_TITLE}</h6>
                        </div>
                    </div>
                </a>
            </Link>

            <BasicModal 
                websiteContent={websiteContent} 
                buttonText={"Make enquiry"}
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen} />

            <div className={styles.links_container}>
                {/* <Link href="/destinations" scroll={false}>
                    <span className="link-primary">Destinations</span>
                </Link>
                <Link href="/activities" scroll={false}>
                <span className="link-primary">Activities</span>
                </Link> */}
                {/* <div onClick={() => {
                    ANALYTICS_logEvent('I want to learn more pressed', {});
                    setIsDialogOpen(true);
                }}>
                    <span className="link-primary">I want to learn more</span>
                </div> */}
                <div onClick={() => { setIsHamburgerActive(true) }}
                    className={"hamburger hamburger--slider " + (isHamburgerActive ? 'is-active' : '')}>
                    <div className="hamburger-box">
                        <div className="hamburger-inner"></div>
                    </div>
                </div>
            </div>

        </div>
    )
}
