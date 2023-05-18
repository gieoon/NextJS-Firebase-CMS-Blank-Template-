import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context';
import { enums2Map } from '../helpers';
import { ACTIVITY_TYPE } from '../models/ACTIVITY_TYPE';
import styles from '../styles/SearchBar.module.scss';
import StandardDropdown from './shared/StandardDropdown';
import StandardDropdownMultiple from './shared/StandardDropdownMultiple';
import { collectionNameToUrl, stripHTML } from '../CMS/helpers';
import { ANALYTICS_logEvent } from '../firebase/analytics';
import { useRouter } from 'next/router';

const SearchBar = () => {

    const router = useRouter();

    const [isShowingAdvanced, setIsShowingAdvanced] = useState(false);

    const {dynamicList} = useContext(GlobalContext);

    return (
        <div className={styles.SearchBar}>
            {/* <input 
                defaultOption={searchTerm || "'South Island', 'Queenstown'"}
                onChange={(e) => setSearchTerm(e.target.value || "") }
            /> */}

            { isShowingAdvanced ?
                <>
                    <StandardDropdown 
                        label="Starting from"
                        options={[]}
                        onChange={(d: any) => {
                            // NO ACTION
                        }} />

                    <StandardDropdown 
                        label="Ending at"
                        options={[]}
                        onChange={(d: any) => {
                            // NO ACTION
                        }} />
                </>
                : <></>
            }

            { isShowingAdvanced ?
                <>

                    <StandardDropdownMultiple
                        label="Type of activities"
                        options={enums2Map(ACTIVITY_TYPE)}
                        onChange={(a: any) => {
                            // NO ACTION
                        }} /> 

                </>
                : <></>
            }
        </div>
    );
}

export default SearchBar;