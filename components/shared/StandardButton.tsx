import { ArrowRight, ArrowRightAlt, KeyboardArrowRight } from '@mui/icons-material';
import { ArrowRightCircle } from 'react-feather';
import { ANALYTICS_logEvent } from '../../firebase/analytics';
import styles from '../../styles/shared/StandardButton.module.scss';

export default function StandardButton({
    text,
    cb,
    isCta,
    isMaxWidth,
    leftAlign,
}) {
    // console.log("Booking for trip: ", _trip)

    return (
        <div className={styles.StandardButton} style={{
            marginLeft: leftAlign ? '0': ''
        }}>
            <div className={styles.inner + " " + (isCta ? styles.is_cta : '') + " " + (isMaxWidth ? styles.is_max_width : '')} 
                onClick={() => {
                    ANALYTICS_logEvent(text + ' pressed', {});
                    cb();
                }} style={{
                    marginLeft: leftAlign ? '0' : ''
                }}>
                {/* <span>Make a booking</span> */}
                <span>{text}
                    <KeyboardArrowRight sx={{width: '32px', height: '32px'}} />
                </span>
            </div>
        </div>
    );
}