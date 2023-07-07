import Slider from "@mui/material/Slider";
import { FC, ReactElement } from "react";
import styles from '../../styles/shared/StandardSlider.module.scss';

interface StandardSliderProps {
    label: ReactElement,
    ranges: any[],
    onChange: Function,
}

const StandardSlider: FC<StandardSliderProps> = ({
    label,
    ranges,
    onChange,
}) => {
    return (
        <div className={styles.StandardSlider}>
            {label}
            {/* <input 
                onChange={(e) => onChange(e.target.value)} 
            /> */}
            <Slider 
                onChange={(e: any) => onChange(e.target.value)}
                aria-label="Temperature"
                defaultValue={ranges[0].value}
                getAriaValueText={(value, index) => ranges[index].label}
                valueLabelDisplay="auto"
                // step={ranges.length}
                marks={ranges}
                min={ranges[0].value}
                max={ranges.slice(-1)[0].value}
            />
        </div>
    );
}

export default StandardSlider;
