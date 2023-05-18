import styles from '../styles/ContactPage.module.scss';
import ContactForm from '../components/ContactForm';

export default function ContactPage() {
    return (
        <div className={styles.ContactPage}>
            <ContactForm textColor="black" />
        </div>
    )
}