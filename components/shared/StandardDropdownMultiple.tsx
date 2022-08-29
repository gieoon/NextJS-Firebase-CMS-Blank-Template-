import { FC } from 'react';
import Select, { ActionMeta, OnChangeValue } from 'react-select'

interface StandardDropdownMultipleProps {
    label: string,
    options: any[],
    onChange: Function,
    // onInputChange: Function,
}

/*
    options: [
        { value: '', label: '' },
        { value: '', label: '' },
    ]
*/
const StandardDropdownMultiple: FC<StandardDropdownMultipleProps> = ({label, options, onChange}) => {

    const handleChange = (
        newValue: OnChangeValue<any, false>,
        actionMeta: ActionMeta<any>
    ) => {
        // console.group('Value Changed');
        // console.log(newValue);
        // console.log(`action: ${actionMeta.action}`);
        // console.groupEnd();

        onChange(newValue.value, actionMeta);
    }

    const handleInputChange = (inputValue: any, actionMeta: any) => {
        // console.group('Input Changed');
        // console.log(inputValue);
        // console.log(`action: ${actionMeta.action}`);
        // console.groupEnd();

        // onInputChange(inputValue, actionMeta);
    };

    return (
        <div className="standard-dropdown">
            <label className="standard-input-label">{label}</label>
            <Select
                defaultValue={[options[0]]}
                isMulti={true}
                options={options} 
                onInputChange={handleInputChange}
                onChange={handleChange}
                isClearable={true} />
        </div>        
    );
}

export default StandardDropdownMultiple;