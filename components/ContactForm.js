import { Email } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { loadDynamicData, stripHTML } from '../CMS/helpers';
import Loading from '../CMS/Loading';
import { APP_TITLE, PROJECT_NAME, sendData } from '../constants';
import styles from '../styles/ContactForm.module.scss';
import StandardDropdown from './shared/StandardDropdown';
import { ANALYTICS_logEvent } from '../firebase/analytics';

export default function ContactForm({
    showTripsDropdown,
    textColor,
}) {
    
    const [isLoading, setIsLoading] = useState(false);
    const [isShowingThankYou, setIsShowingThankYou] = useState(false);
    const [currentTour, setCurrentTour] = useState(undefined);
    const [trips, setTrips] = useState([]);

    const loadTrips = async () => {
        var _trips = await loadDynamicData(PROJECT_NAME, 'Trips');
        setTrips(_trips);
    }
  
    useEffect(() => {
        loadTrips();
    }, []);

    const submit = async () => {
        
        setIsLoading(true);

        var customText = document.querySelector('#contact-form-textarea').value;
        var emailAddress = document.querySelector('#email-address').value;
        if(!emailAddress || emailAddress === "") return;
        
        const items = [
            {
                field: "Full name",
                value: document.querySelector('#full-name').value,
            },
            {
                field: "Email address",
                value: emailAddress,
            },
            {
                field: "Phone number",
                value: document.querySelector('#phone-number').value
            },
            {
                field: "Message",
                value: customText
            },
        ];

        // Only for header input.
        if (showTripsDropdown) {
            items.push(
                {
                    field: "Guided walk",
                    value: document.querySelector("guided-walk").value,
                },
            );
        }

        const cb = () => {
            setIsLoading(false);
            setIsShowingThankYou(true);
        }

        sendData(items, cb);

    }

    return (
        <div className={styles.ContactForm + " contact-form"}>

            { isShowingThankYou 
                ? <h2 className="thankyou">Thanks, we'll respond to you soon 😊</h2>
                : <>

                    { showTripsDropdown
                        ? <>
                            <input type="hidden" value={currentTour} id="guided-walk" />
                            <StandardDropdown 
                                label="Select a tour"
                                options={trips.map(t => { return { label: stripHTML(t.title), value: stripHTML(t.title)} })}
                                // onChange={(val)=>setCurrentTour(val.value)}
                                onInputChange={(val)=>setCurrentTour(val.value)} />
            
                            {/* <p>Or ask us directly</p> */}
                        </>
                        : <>
                            <h2 className={styles.title} style={{
                                color: textColor,
                            }}>Find out more</h2>
                        </>
                    }

                    <input id="full-name" type="text" className="standard-input" placeholder="My full name" name="Name" />

                    <input id="email-address" type="email" className="standard-input" placeholder="My email" name="Email" />

                    <input id="phone-number" type="number" className='standard-input' placeholder="My phone number" name="Phone" />

                    <textarea id="contact-form-textarea" placeholder="My message" name="Message" />

                    <div className="submit" onClick={() => {
                        ANALYTICS_logEvent('Form submit pressed', {
                            isFromHeader: showTripsDropdown,
                        });
                        submit();
                    }}>Get in touch</div>
                </>
            }

            <Loading 
                loading={isLoading} 
                backgroundColor={'white'}//{'rgb(242,84,91)'}
                loaderColor={'rgb(240, 135, 140)'}
                loadingTexts="We're sending your enquiry to the operator."
                forceAbsolute={true} />

        </div>
    );
}