import styles from '../styles/StandardPopup.module.scss';

export default function StandardPopup({
    header,
    content,
    bottom,
    isVisible,
    onClose,
}) {
    return (
        <div className={styles.StandardPopup + " standard-popup " + (isVisible ? styles.visible : '')}>
            <div className={styles.background} onClick={(e) => {
                
                if (Array.from(e.target.classList).includes(styles.background) ) {
                    onClose();
                }
            }}>
                <div className={styles.modal}>
                    <div className={styles.header}>
                        {header}
                    </div>
                    <div className={styles.content}>
                        {content}
                    </div>
                    <div className={styles.bottom}>
                        {bottom}
                    </div>
                </div>
            </div>
        </div>
    );
}
