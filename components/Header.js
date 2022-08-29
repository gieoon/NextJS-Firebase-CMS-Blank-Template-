import styles from '../styles/Header.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState } from 'react';
import BasicModal from './Dialog';
import { GlobalContext } from '../context';
import { ANALYTICS_logEvent } from '../firebase/analytics';

export default function Header() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const {websiteContent} = useContext(GlobalContext);

    return (
        <div className={styles.Header}>
            
            <Link href="/" className={styles.home_link}>
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
                        {/* I Need<br/>  */}
                        {/* <p>I Need Nature</p> */}
                        {/* <p>N Ξ Ξ D <span style={{margin:'10px'}} /> N Λ T V R Ξ</p> */}
                    </div>
                </div>
            </Link>

            <BasicModal 
                websiteContent={websiteContent} 
                buttonText={"Make enquiry"}
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen} />

            <div className={styles.links_container}>
                {/* <Link href="/destinations">
                    <span className="link-primary">Destinations</span>
                </Link>
                <Link href="/activities">
                <span className="link-primary">Activities</span>
                </Link> */}
                <div onClick={() => {
                    ANALYTICS_logEvent('I want to learn more pressed', {});
                    setIsDialogOpen(true);
                }}>
                    <span className="link-primary">I want to learn more</span>
                </div>
            </div>

        </div>
    )
}