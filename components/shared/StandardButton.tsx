import Send from '@mui/icons-material/Send';
import ArrowRight from "@mui/icons-material/ArrowRight";
import Link from "next/link";
import { FC, ReactElement } from "react";
import Loading from '../../CMS/Loading';
import styles from '../../styles/shared/StandardButton.module.scss';

interface StandardButtonProps {
    text: string,
    slug?: string,
    cb?: Function,
    isCta?: boolean,
    disabled?: boolean,
    isLoading?: boolean,
    isLeftAligned?: boolean,
}

const StandardButton: FC<StandardButtonProps> = ({
    text,
    cb,
    slug,
    isCta,
    disabled,
    isLoading,
    isLeftAligned,
}) => {
    
    const button = <div className={styles.StandardButton + " " + (disabled ? styles.disabled : '') + ' ' + (isLoading ? styles.loading : '')} 
    onClick={() => {
        if (cb) cb();
    }}>
        <div className={styles.inner + " " + (isLeftAligned ? styles.left_aligned : '')} >
            <div className={styles.background} />
            <p>{text} 
                { isCta ? <Send /> : <></> }
            </p>
    
            <div style={{
                zIndex: 1,
                margin: "auto",
                position: "absolute",
                left: 0,
                right: 0,
                // transform: 'translateX(-5px)',
            }}>
                <Loading 
                    loading={isLoading}
                    forceAbsolute={true}
                    loaderColor='white'//{'var(--secondary)'}
                    backgroundColor="transparent"
                    loadingTexts=""
                />
            </div>
        </div>
    </div>;

    if (slug) {
        return <Link href={slug} scroll={false}>
            <a>
                {button}
            </a>
        </Link>
    }
    
    else return button
}

export default StandardButton;
