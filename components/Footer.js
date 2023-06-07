import Link from 'next/link';
import styles from '../styles/Footer.module.scss';
import Image from 'next/image';
import { APP_TITLE, imgLoader } from '../constants';
import { useContext } from 'react';
import { GlobalContext } from '../context';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { Help } from '@mui/icons-material';
import ContactForm from './ContactForm';

export default function Footer () {

    const {websiteContent} = useContext(GlobalContext);

    return (
        <div className={styles.Footer}>

            <div className={styles.background} />

            <div className={styles.inner}>

                {/* <div className={styles.contact_details}> */}
                    {/* <Image src="/help_icon.jpg" 
                        width="35"
                        height="35" /> */}
                    {/* <Help htmlColor={'#5e717d'} /> */}
                    {/* <h2 id="footerContactDesc" className={styles.footerContactDesc}>{websiteContent.footerContactDesc}</h2> */}
                    {/* <div className={styles.footerContactLinks}>
                        <p><PhoneIcon /> Call <b><a id="footerPhoneNumber" className="cp-editable-btn" href={`tel:${websiteContent.footerPhoneNumber}`}>{websiteContent.footerPhoneNumber}</a></b></p>
                        <p><EmailIcon /> Email <b><a id="footerEmail" className="cp-editable-btn" href={`mailto:${websiteContent.footerEmail}`}>{websiteContent.footerEmail}</a></b></p>
                    </div> */}
                {/* </div> */}

                <div className={styles.links_container}>
                    {/* <Link href="/destinations" scroll={false}>
                        <span className="link-white">Destinations</span>
                    </Link>
                    <Link href="/activities" scroll={false}>
                        <span className="link-white">Activities</span>
                    </Link> */}
                    {/* <Link href="/destinations/new-zealand" scroll={false}>
                        New Zealand
                    </Link> */}
                </div>

                <ContactForm textColor="white" /> 
                {/* textColor="white" */}
                {/* "rgb(51, 51, 51)" */}

                {/* <div className={styles.socials_container}> */}
                    {/* <div><Image src={"/social-facebook.svg"} width="25" height="25" /></div> */}
                    {/* <div className="cp-editable-img"><Image src={"/social-instagram.svg"} width="25" height="25" 
                    //loader={imgLoader} 
                    /></div> */}
                {/* </div> */}

                <p className={styles.brand_name}>
                    {APP_TITLE} &copy; {new Date().getFullYear()} - All Rights Reserved 
                    - <a href="/login" className={styles.login_a}>Login</a>
                </p>

                <div className={styles.rotary_container}>
                    <p id="footerDesc" className="cp-editable">{websiteContent.footerDesc}</p>

                    {/* <Image src={"/rotary_logo.svg"} width="75" height="35" /> */}
                    <br/>
                    {/* <p>Made by <a href="https://webbi.co.nz" target="_blank" rel="noreferer noopener" className={styles.login_a}>Webbi</a></p> */}
                </div>

            </div>
        </div>
    )
}
