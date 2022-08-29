import { FC, useContext } from 'react';
import Select, { ActionMeta, OnChangeValue } from 'react-select'
import CreatableSelect from 'react-select/creatable';
import { stripHTML } from '../../CMS/helpers';
import { GlobalContext } from '../../context';

interface StandardDropdownProps {
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
const StandardDropdown: FC<StandardDropdownProps> = ({label, options, onChange}) => {

    const {currentTrip} = useContext(GlobalContext);

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
            <CreatableSelect 
                options={options} 
                defaultValue={{label: stripHTML(currentTrip?.title), value: stripHTML(currentTrip?.title)}}
                // onInputChange={handleInputChange}
                onChange={handleChange}
                isClearable={false}
                styles={{
                    singleValue: (provided, state) => {
                        return {
                            ...provided,
                            color: 'black',
                        };
                    },
                    option: (provided, state) => ({
                        ...provided,
                        color: 'black',
                    }),
                    control: (provided, state) => ({
                        ...provided,
                        color: ''
                    })
                }} />
        </div>        
    );
}

export default StandardDropdown;