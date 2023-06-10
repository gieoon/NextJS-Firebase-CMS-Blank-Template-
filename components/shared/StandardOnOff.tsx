import { FC, ReactElement } from "react";
import styles from '../styles/StandardOnOff.module.scss';

interface StandardOnOffProps {
    id?: string,
    label: ReactElement,
    isForcedOn?: boolean,
    onChange?: Function,
}

const StandardOnOff: FC<StandardOnOffProps> = ({
    id,
    label,
    isForcedOn,
    onChange,
}) => {
    return (
        <div className={styles.StandardOnOff}>
            {label}
            <input 
                id={id || ''}
                type='checkbox' 
                defaultChecked={isForcedOn} 
                disabled={isForcedOn}
                onChange={(e) => {
                    // console.log(e.target, e.target.checked);
                    if (onChange) onChange(e.target.checked)
                }} 
            />
        </div>
    );
}

export default StandardOnOff;
