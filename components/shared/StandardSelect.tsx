import { FC, ReactElement } from "react";
import { ActionMeta, InputActionMeta } from "react-select";
// import Select from "react-select/dist/declarations/src/Select";
import Select from 'react-select';
import styles from '../../styles/shared/StandardSelect.module.scss';

interface StandardSelectProps {
    label: ReactElement,
    options: any[],
    onChange: Function,
}

const StandardSelect: FC<StandardSelectProps> = ({
    label,
    options,
    onChange,
}) => {
    return (
        <div>
            <label>{label}</label>
            <Select 
                options={options}
                // value={options[0]}     
                onChange={function (newValue: any, actionMeta: ActionMeta<any>): void {
                    onChange(newValue.value);
                } }
                inputValue={""}
                onInputChange={function (newValue: string, actionMeta: InputActionMeta): void {
                    // throw new Error("Function not implemented.");
                } } onMenuOpen={function (): void {
                    // throw new Error("Function not implemented.");
                } } onMenuClose={function (): void {
                    // throw new Error("Function not implemented.");
                } }
            />
        </div>
    );
}

export default StandardSelect;
