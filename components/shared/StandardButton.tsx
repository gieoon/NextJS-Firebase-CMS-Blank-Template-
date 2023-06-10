import ArrowForward from '@mui/icons-material/ArrowForward';
import ArrowRight from "@mui/icons-material/ArrowRight";
import Link from "next/link";
import { FC, ReactElement } from "react";
import Loading from '../../CMS/Loading';
import styles from '../../styles/StandardButton.module.scss';

interface StandardButtonProps {
    text: string,
    slug?: string,
    cb?: Function,
    isCta?: boolean,
    disabled?: boolean,
    isLoading?: boolean,
}

const StandardButton: FC<StandardButtonProps> = ({
    text,
    cb,
    slug,
    isCta,
    disabled,
    isLoading,
}) => {
    const button = <div className={styles.StandardButton + " " + (disabled ? styles.disabled : '')} onClick={() => {
        if (cb) cb();
    }}>
        <div className={styles.background} />
        <p>{text} 
            { isCta ? <ArrowForward /> : <></> }
        </p>

        <Loading 
            loading={isLoading}
            forceAbsolute={true}
            loaderColor={'var(--primary)'}
            backgroundColor="white"
            loadingTexts=""
        />
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
