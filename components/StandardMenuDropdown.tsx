import Send from '@mui/icons-material/Send';
import ArrowRight from "@mui/icons-material/ArrowRight";
import Link from "next/link";
import { FC, ReactElement } from "react";
import Loading from '../CMS/Loading';
import styles from '../../styles/shared/StandardMenuDropdown.module.scss';

interface StandardMenuDropdownProps {
    children: ReactElement,
    isActive: boolean,
    setIsActive: Function,
}

const StandardMenuDropdown: FC<StandardMenuDropdownProps> = ({
    children,
    isActive,
    setIsActive,
}) => {
    return <div className={styles.StandardMenuDropdown + " " + (isActive ? styles.active : "")}>
        <div className={styles.background} onClick={(e) => {
            console.log('background e target', e.target);
            setIsActive(false);
        }}/>
        <div className={styles.content}>
            {children}
        </div>
    </div>
}

export default StandardMenuDropdown;
