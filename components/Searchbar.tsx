import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context';
import { enums2Map } from '../helpers';
import { ACTIVITY_TYPE } from '../models/ACTIVITY_TYPE';
import styles from '../styles/SearchBar.module.scss';
import StandardDropdown from './shared/StandardDropdown';
import StandardDropdownMultiple from './shared/StandardDropdownMultiple';
import Destination from '../models/Destination';
import Language from '../models/Language';
import { collectionNameToUrl, stripHTML } from '../CMS/helpers';
import { ANALYTICS_logEvent } from '../firebase/analytics';
import { useRouter } from 'next/router';

const SearchBar = () => {

    const router = useRouter();

    const [isShowingAdvanced, setIsShowingAdvanced] = useState(false);
    const [currentDestination, setCurrentDestination] = useState<Destination>();
    const [startingFrom, setStartingFrom] = useState<Destination>();
    const [endingAt, setEndingAt] = useState<Destination>();
    const [duration, setDuration] = useState<any>();
    const [activityType, setActivityType] = useState<ACTIVITY_TYPE[]>([]);
    const [language, setLanguage] = useState<Language>();

    const {searchTerm, setSearchTerm, destinations, languages} = useContext(GlobalContext);

    const _destinations = destinations.map(d => {
        return {
            label: stripHTML(d.title),
            value: stripHTML(d.title),
        }
    }).sort((a, b) => a.label > b.label ? 1 : -1);

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
                        options={destinations}
                        onChange={(d: Destination) => {
                            setStartingFrom(d);
                        }} />

                    <StandardDropdown 
                        label="Ending at"
                        options={destinations}
                        onChange={(d: Destination) => {
                            setEndingAt(d);
                        }} />
                </>
                : <></>
            }

            <StandardDropdown 
                label="My destination"
                options={_destinations}
                onChange={(d: Destination) => {
                    setCurrentDestination(d);
                    
                    // console.log(collectionNameToUrl(d));

                    // Go to page.
                    ANALYTICS_logEvent('Searchbar destination selected', {
                        destination: stripHTML(d),
                    });

                    // router.push('/destinations/' + collectionNameToUrl(d.title));

                }} />

            { isShowingAdvanced ?
                <>

                    <StandardDropdown 
                        label="Duration"
                        options={[
                            {name: 'Less than one day', lowerDuration: 0, upperDuration: 0},
                            {name: 'One day', lowerDuration: 1, upperDuration: 1},
                            {name: '1 - 3 days', lowerDuration: 1, upperDuration: 3},
                            {name: '3 - 7 days', lowerDuration: 3, upperDuration: 7},
                            {name: 'More than one week', lowerDuration: 7, upperDuration: undefined},
                        ]}
                        onChange={(d: any) => {
                            setDuration(d);
                        }} />

                    <StandardDropdownMultiple
                        label="Type of activities"
                        options={enums2Map(ACTIVITY_TYPE)}
                        onChange={(a: ACTIVITY_TYPE[]) => {
                            setActivityType(a);
                        }} /> 

                    
                    <StandardDropdown 
                        label="Language"
                        options={languages}
                        onChange={(l: Language) => {
                            setLanguage(l);
                        }}/>

                </>
                : <></>
            }
        </div>
    );
}

export default SearchBar;