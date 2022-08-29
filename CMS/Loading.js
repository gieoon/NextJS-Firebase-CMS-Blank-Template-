// import '../styles/Loading.module.scss';
import { FormatTextdirectionLToR } from '@mui/icons-material';
import React from 'react';
import styles from './loading.module.css';

export default function Loading({
    loading,
    backgroundColor,
    loadingTexts,
    forceAbsolute, // Show inside a child container instead of whole screen?
    loaderColor,
}){
    return(
        <div>
            <div className={styles.Loading + " " + (loading ? styles.show : "") + " " + (forceAbsolute ? styles.forceAbsolute : "")}>
                <div className={styles.double_bounce1} style={{
                    backgroundColor: loaderColor,
                }}></div>
                <div className={styles.double_bounce2} style={{
                    backgroundColor: loaderColor,
                }}></div>
            </div>
            <div className={styles.Loading_overlay + " " + (loading ? styles.show : "") + " " + (forceAbsolute ? styles.forceAbsolute : "")}
                style={{
                    backgroundColor: backgroundColor,
                }}
            >

                <div className={styles.Loading_packaging}></div>

            </div>
        </div>
    );
}