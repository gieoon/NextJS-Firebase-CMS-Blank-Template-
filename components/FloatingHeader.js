import styles from '../styles/FloatingHeader.module.scss'
import Image from 'next/image';
import { DUMMY_NEXT_MEETING, DUMMY_NEXT_MEETING_DATE, imgLoader, websiteContent } from '../constants';
import { useContext, useState } from 'react';
import { GlobalContext } from '../context';
import Link from 'next/link';
import { stripHTML } from '../CMS/helpers';
import { ANALYTICS_logEvent } from '../firebase/analytics';
import BasicModal from './Dialog';

export default function FloatingHeader({
    isVisible,
}) {
    const {websiteContent} = useContext(GlobalContext);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showTripsDropdown, setShowTripsDropdown] = useState(false);

    return (
        <div className={styles.FloatingHeader + " " + (isVisible ? styles.visible : "")}>
            <div className={styles.logo_container}>
                <img src="/logo_white_transparent.png" style={{
                    width: '100px',
                    marginLeft: '-10px'
                }} />
            </div>

            <div className={styles.button_container}>

                {/* <Link href="/events">
                    <p className={styles.link}>Events</p>
                </Link> */}

                <div className={styles.title}>
                    {stripHTML('Test content')}
                </div>

                {/* <div>
                    <p className={styles.pre_text}>Our next meeting:</p>
                    <p id="nextMeetingDate" className={styles.date + " cp-editable"}>{websiteContent.nextMeetingDate}</p>
                </div> */}

                <BasicModal 
                    websiteContent={websiteContent} 
                    buttonText={"Make enquiry"}
                    isOpen={isDialogOpen}
                    setIsOpen={setIsDialogOpen}
                    showTripsDropdown={showTripsDropdown} />

                <div id="floatingHeaderCta" className={styles.button + " cp-editable"}
                    onClick={() => {
                        ANALYTICS_logEvent('Floating Header Make an enquiry pressed', {});
                        setShowTripsDropdown(false);
                        setIsDialogOpen(true);
                }}>    
                    <span>Make an enquiry</span>
                </div>
                
                {/* <Link href="/join"> */}
                <div id="floatingHeaderCta" className={styles.button + " " + styles.join_button + " cp-editable"}
                    onClick={() => {
                        ANALYTICS_logEvent('Floating Header Make an enquiry pressed', {});
                        setShowTripsDropdown(true);
                        setIsDialogOpen(true);
                }}>    
                    <span>Book now</span>
                </div>
                {/* </Link> */}
            </div>
        </div>
    )
}