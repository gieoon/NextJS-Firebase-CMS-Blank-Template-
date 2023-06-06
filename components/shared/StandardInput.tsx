import { FC, useState } from "react";
import styles from '../styles/StandardInput.module.scss';

interface StandardInputProps {
    label: string,
    type?: string,
    name?: string,
    isLong?: boolean,
    placeholder: string,
    onChange: Function,
    isValidFn?: Function,
    defaultText?: string,
}

const StandardInput: FC<StandardInputProps> = ({
    label,
    type,
    name,
    isLong,
    placeholder,
    onChange,
    isValidFn,
    defaultText,
}) => {
    const [isFocused, setIsFocused] = useState(defaultText !== undefined);
    return (
        <div className={styles.StandardInput + " " + (isFocused ? styles.focused : '')}>
            <label className={isFocused ? styles.focused : ''}>{label}</label>
            { isLong 
                ? <textarea 
                    defaultValue={defaultText}
                    name={name || undefined}
                    // placeholder={placeholder}
                    onChange={e => {
                        if (onChange) onChange(e.target.value)
                    }}
                />
                : <input 
                    // onFocus={(el) => el.target.classList.toggle(styles.focused)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={(e) => {
                        if (!e.target.value.length)
                            setIsFocused(false);
                    }}
                    defaultValue={defaultText} 
                    type={type || 'text'} 
                    name={name || undefined}
                    // placeholder={placeholder} 
                    onChange={(e) => {
                        if (onChange) {
                            onChange(e.target.value)
                        }
                    }} 
                />
            }
        </div>
    );
}

export default StandardInput;
