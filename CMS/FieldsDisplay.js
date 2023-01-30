// Displaying custom fields in the CMS based on templates created in Firestore.

import React, {useEffect, useRef, useState} from 'react';
import {Check, ChevronDown, ChevronUp, Plus, Square} from 'react-feather';
import styles from './CMS.module.scss';
import Select from 'react-select';
import { collection, getFirestore } from 'firebase/firestore';
import { loadDynamicData, loadFromPath, stripHTML, swapIndexes } from './helpers';
import { uuidv4 } from '@firebase/util';
import { PROJECT_NAME } from '../constants';
import { Remove } from '@mui/icons-material';
import TextEditor from './TextEditor';
import RichTextEditor, {createEmptyValue, EditorValue} from 'react-rte';

export default function FieldsDisplay({
    currentSection,
    allFields,
    currentFields,
}){
    const getSectionIndexFromName = (currentSection, allFields) => {
        for(var i=0;i<allFields.length;i++){
            // Field's unique key is its name.
            if(allFields[i].name === currentSection.name){
                return allFields[i].fields;
            }
        }
    }

    const [sectionFields, setSectionFields] = useState(
        getSectionIndexFromName(currentSection, allFields)
    );

    useEffect(()=>{
        setSectionFields(getSectionIndexFromName(currentSection, allFields));
        // console.log("currentSection updating: ", currentSection);
    }, [currentSection]);

    // useEffect(()=>{
    //     console.log('current fields changed');
    // }, [currentFields]);

    // console.log('allFields', allFields);
    // console.log('sectionFields', sectionFields);
    // console.log('currentFields', currentFields);

    return(
        <div className="FieldsDisplay">
            {
                (sectionFields || []).map((field, i) => (
                    <div className="field" key={"field-"+i}>
                        {getFieldDisplay(currentFields, field)}
                        
                        <hr />
                    </div>
                ))
            }
        </div>
    )
}

const getFieldDisplay = (currentFields, field) => {
    switch(field.type){
        case "count/total":
            return <CountTotal currentFields={currentFields} field={field} />
        case "on/off":
            // Switch with on or off    
            return <OnOff currentFields={currentFields} field={field} />
        case "slug":
            return <Slug currentFields={currentFields} field={field} />
        case "text":
            return <TextField currentFields={currentFields} field={field} />
        case "text-long":
            return <TextLongField currentFields={currentFields} field={field} />
        case 'rich-text':
            return <RichTextField currentFields={currentFields} field={field} />
        // Dropdown that takes a single value from another collection.
        case "collections-dropdown":
            return <CollectionsDropdownField currentFields={currentFields} field={field} />
        // Array that takes values from another collection.
        case "collections-array":
            return <CollectionsArrayField currentFields={currentFields} field={field} />
        case "float":
            return <FloatField currentFields={currentFields} field={field} />
        // Whole numbers
        case "whole-number":
            return <WholeNumberField currentFields={currentFields} field={field} />
        // Select from hardcoded options under field.options in FIRESTORE
        case "standard-dropdown":
            return <StandardDropdownField currentFields={currentFields} field={field} />
        // Multi-select
        case "standard-dropdown-multiple":
            return <StandardDropdownMultipleField currentFields={currentFields} field={field} />
        case "collections-dropdown-multiple":
            return <CollectionsDropdownMultipleField currentFields={currentFields} field={field} />
        default: 
            return <></>;
    }
}

const getCurrentField = (currentFields, field) => {
    // console.log('field.label: ', field.label)
    for(var c of currentFields) {
        // label is unique key.
        // If label exists in the currentField, it is the correct one.
        if (field.label in c) {
        // if(c.type === field.type){
            // if (field.label === 'Activity Types')
            //     console.log('Found field: ', c);
            return c;
        }
    }
    return {};
}

// Get hardcoded 'internalName' field.
const getInternalNameField = (currentFields) => {
    // console.log("currentFields: ", currentFields)
    for (var c of currentFields) {
        if(c['internalName']) {
            return c['internalName'];
        }
    }
}

const FloatField = ({currentFields, field}) => {
    const convert = () => {
        return {
            type: 'float',
            [field.label]: getCurrentField(currentFields, field)[field.label],
        }
    }

    const [currentField, setCurrentField] = useState(convert());

    useEffect(() => {
        setCurrentField(convert());
    }, [currentFields]);

    return (
        <div className="subfield">
            <h4 id={field.type} className="read-my-type">{field.label}</h4>
            <input 
                type="number"
                className={styles.svg_wrapper_inner + " read-my-value"} 
                key={field.label}
                defaultValue={currentField[field.label]}
                id={field.label} />
        </div>
    )
}


const WholeNumberField = ({currentFields, field}) => {
    const convert = () => {
        return {
            type: 'whole-number',
            [field.label]: getCurrentField(currentFields, field)[field.label],
        }
    }

    const [currentField, setCurrentField] = useState(convert());

    useEffect(() => {
        setCurrentField(convert());
    }, [currentFields]);

    return (
        <div className="subfield">
            <h4 id={field.type} className="read-my-type">{field.label}</h4>
            <input 
                type="number"
                pattern="\d*"
                className={styles.svg_wrapper_inner + " read-my-value"} 
                key={field.label}
                defaultValue={currentField[field.label]}
                id={field.label} />
        </div>
    )
}

const StandardDropdownMultipleField = ({currentFields, field}) => {

    const inputId = field.label// + uuidv4().slice(0, 8);

    const convert = () => {
        return (getCurrentField(currentFields, field)[field.label] || []).map(o => { return {label: o, value: o} });
    }

    const [currentField, setCurrentField] = useState(convert());

    useEffect(() => {
        setCurrentField(convert());
        handleChange(convert())
    }, [currentFields]);

    const handleChange = (vals) => {
        // console.log("Multi-select onCHANGE: ", vals);
        if (vals) {
            var inputEl = document.getElementById(inputId);
            inputEl.value = JSON.stringify(vals.map(o => o.value));
            setCurrentField(vals)//.map(o => { return {label: o, value: o} }))
        }
    }

    // console.log("currentField: ", currentField);

    return (
        <div className="subfield">
            <h4 id={field.type} className="read-my-type">{field.label}</h4>
            
            <Select
                // defaultValue={currentField}
                value={currentField}
                // defaultValue={
                //     [
                //         {
                //             "label": "WALK",
                //             "value": "WALK"
                //         },
                //         {
                //             "label": "CAR",
                //             "value": "CAR"
                //         }
                //     ]
                // }
                options={field.options.map(o => { return {value: o, label: o} })} 
                isMulti={true}
                onInputChange={handleChange}
                onChange={handleChange}
                isClearable={false}
                className="basic-multi-select"
                classNamePrefix="select" />

            {/* Hidden input field to read the value of */}
            <input 
                type="hidden"
                key={inputId}
                id={inputId} 
                className={"read-my-value-multiple"} />

        </div>
    );
}

const StandardDropdownField = ({currentFields, field}) => {

    const inputId = field.label// + uuidv4().slice(0, 8);

    const convert = () => {
        // return {
        //     type: "standard-dropdown",
        //     label: 
        //     [field.label]: getCurrentField(currentFields, field)[field.label],
        // }
        const t = getCurrentField(currentFields, field)[field.label];
        return { label: t, value: t };
    }

    const [currentField, setCurrentField] = useState(convert());

    useEffect(() => {
        setCurrentField(convert());
        handleChange(convert())
    }, [currentFields]);

    const handleChange = (val) => {
        // console.log("val: ", val);
        setCurrentField(val)
    }

    useEffect(() => {
        if (currentField) {
            var inputEl = document.getElementById(inputId);
            if (inputEl) inputEl.value = currentField.value;
        }
    }, [currentField]);

    return (
        <div className="subfield">
            <h4 id={field.type} className="read-my-type">{field.label}</h4>
            
            <Select
                value={currentField}
                options={field.options.map(o => { return {value: o, label: o} })} 
                // onInputChange={handleChange}
                onChange={handleChange}
                isClearable={true} />

            {/* Hidden input field to read the value of */}
            <input 
                // value={currentField.value}
                type="hidden"
                key={inputId}
                id={inputId} 
                className={"read-my-value"} />

        </div>
    );
}


// Display of array coming from a collection with the ability to swap indexes to change it a bit.
const CollectionsArrayField = ({currentFields, field}) => {

    const inputId = field.label// + uuidv4().slice(0, 8);

    const convert = async () => {
        // console.log("parsed: ", JSON.parse(getCurrentField(currentFields, field)[field.label] || "[]"))
        const paths = JSON.parse(getCurrentField(currentFields, field)[field.label] || "[]");
        const out = [];
        for (var path of paths) {
            var docData = await loadFromPath(path);
            var internalName = getInternalNameField(docData.fields);
            var t = stripHTML(docData.title) + "(" + (internalName || "no internalName") + ")";
            out.push({ 
                label: t, 
                value: path 
            });
        }
        // return JSON.parse(getCurrentField(currentFields, field)[field.label] || "[]").map(o => { return {label: o, value: o} });
        return out//.sort((a,b) => a.label > b.label ? 1 : -1);
    }

    const [documents, setDocuments] = useState(undefined);
    const [currentField, setCurrentField] = useState([]);
    const [selectField, setSelectField] = useState();

    useEffect(() => {
        convert().then((o) => setCurrentField(o));

        // Load the collection in from external source.
        loadDynamicData(PROJECT_NAME, field.collectionName)
            .then(d => setDocuments(
                d.map(dd => { return {
                    label: stripHTML(dd.title) + "(" + (getInternalNameField(dd.fields) || "no internalName") + ")",
                    value: dd.path,
                    ...dd
                }
            }).sort((a, b) => a.label > b.label ? 1 : -1)
        ));

    }, [currentFields]);

    const handleChange = (val) => {
        // console.log("val: ", val);
        setSelectField(val);
    }

    const deleteIndex = (index) => {
        // console.log("deleting index");
        const _currentField = currentField.slice();
        _currentField.splice(index, 1);
        setCurrentField([..._currentField]);
    }

    // if (!documents) {
    //     return <h4>Loading...</h4>
    // }
    // console.log('collections array current fields: ', currentField)
    // console.log('options: ', documents);
    // console.log('selectField: ', selectField)

    return (
        <div className="subfield">

            <h4 id={field.type} className="read-my-type">{field.label}</h4>

            { (currentField || []).map((val, i) => (
                    <div key={'collections-array'+i}>
                        <div>{val.label} ({val.value})</div>
                        { i > 0 
                            ? <ChevronUp onClick={() => swapIndexes(i, i-1)}/>
                            : <></>
                        }
                        { i < currentField.length - 1
                            ? <ChevronDown onClick={() => swapIndexes(i, i+1)}/>
                            : <></>
                        }
                        <div><Remove onClick={() => deleteIndex(i) } /></div>
                    </div>
                ))
            }

            <label>Add new</label>
            <Select
                defaultValue={''}
                options={documents} 
                // onInputChange={handleChange} // This retriggers a change to empty on onBlur
                onChange={handleChange}
                isClearable={true} />

            {/* Hidden input field to read the value of */}
            <input 
                value={JSON.stringify(currentField.map(o => o.value ))}
                type="hidden"
                key={inputId}
                id={inputId} 
                className={"read-my-value"} />

            <Plus onClick={() => {
                
                setCurrentField([...currentField, selectField]);

            }} />
        </div>
    );
}


const CollectionsDropdownMultipleField = ({currentFields, field}) => {

    const inputId = field.label// + uuidv4().slice(0, 8);

    const convert = async () => {
        var paths;
        try {
            paths = JSON.parse(getCurrentField(currentFields, field)[field.label] || "[]");
        } catch (err) {
            // Backward compatibility.
            paths = getCurrentField(currentFields, field)[field.label]
            if (!Array.isArray(paths)) {
                paths = [paths];
            }
        }
        // console.log("CollectionsDropdownField paths: ", paths);
        const out = [];
        for (var path of paths) {
            try {
                var docData = await loadFromPath(path);
                var t = stripHTML(docData.title);
                var internalName = getInternalNameField(docData.fields);
                out.push({
                    label: t + "(" + (internalName || "no internalName") + ")",
                    value: path
                });
            } catch (err) {
                console.log("ERROR LOADING path: ", path);
            }
        }

        return out;
    }

    const [currentField, setCurrentField] = useState([]);
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        convert().then(o => {
            setCurrentField(o);
            handleChange(o);
        });

        // Load the collection in from external source.
        loadDynamicData(PROJECT_NAME, field.collectionName)
            .then(d => setDocuments(
                    d.map(dd => { return {
                        label: stripHTML(dd.title) + "(" + (getInternalNameField(dd.fields) || "") + ")",
                        value: dd.path,
                        // ...dd
                    }
                }).sort((a, b) => a.label > b.label ? 1 : -1)
            ));
    }, [currentFields]);

    const handleChange = (vals) => {
        if (vals) {
            var inputEl = document.getElementById(inputId);
            // What's actually saved to DB.
            inputEl.value = JSON.stringify(vals.map(o => o.value));
            setCurrentField(vals)//.map(o => { return {label: o, value: o} }))
        }
    }

    // console.log("currentField: ", currentField);

    return (
        <div className="subfield">
            <h4 id={field.type} className="read-my-type">{field.label}</h4>
            
            <Select
                value={currentField}
                options={documents} 
                isMulti={true}
                onInputChange={handleChange}
                onChange={handleChange}
                isClearable={false}
                className="basic-multi-select"
                classNamePrefix="select" />

            {/* Hidden input field to read the value of */}
            <input 
                type="hidden"
                key={inputId}
                id={inputId} 
                className={"read-my-value-multiple"} />

        </div>
    );
}

// Options that come from another user-created collection.
const CollectionsDropdownField = ({currentFields, field}) => {

    const inputId = field.label//.replace(/ /g,'_') + '_' + uuidv4().slice(0, 8);

    const convert = async () => {
        const path = getCurrentField(currentFields, field)[field.label];
        // console.log("CollectionsDropdownField path: ", path);
        if (!path) return {};
        var docData = await loadFromPath(path);
        var t = stripHTML(docData.title);
        console.log("docData: ", docData)
        var internalName = getInternalNameField(docData.fields);

        return {
            label: t + "(" + (internalName || "no internalName") + ")",
            value: path,
        }
    }

    const [currentField, setCurrentField] = useState([]);
    const [documents, setDocuments] = useState(undefined);

    useEffect(() => {
        convert().then(o => {
            setCurrentField(o);
            handleChange(o)
        });

        // Load the collection in from external source.
        loadDynamicData(PROJECT_NAME, field.collectionName)
            .then(d => setDocuments(
                    d.map(dd => { 
                        return {
                            label: stripHTML(dd.title) + "(" + (getInternalNameField(dd.fields) || "") + ")",
                            value: dd.path,
                            // ...dd
                        }
                    }).sort((a, b) => a.label > b.label ? 1 : -1)
            ));

    }, [currentFields]);

    useEffect(() => {
        if (currentField) {
            var inputEl = document.getElementById(inputId);
            if (inputEl) inputEl.value = currentField.value;
        }
    }, [currentField])

    const handleChange = (val) => {
        console.log('val: ', val.value)
        // var inputEl = document.getElementById(inputId);
        // inputEl.value = val.value;
        setCurrentField(val);
    }
    
    if (!documents) {
        return <h4>Loading...</h4>
    }

    // console.log("currentField: ", currentField)

    return (
        <div className="subfield">
            <h4 id={field.type} className="read-my-type">{field.label}</h4>
            
            <Select
                // defaultValue={currentField}
                value={currentField}
                options={documents} 
                onChange={handleChange}
                isClearable={true} />

            {/* Hidden input field to read the value of */}
            <input 
                // value={currentField.value}
                type="hidden"
                key={inputId}
                id={inputId} 
                className={"read-my-value"} />

        </div>
    );
}

const TextLongField = ({currentFields, field}) => {

    const convert = () => {
        return {
            type: "text-long",
            [field.label]: getCurrentField(currentFields, field)[field.label],
        }
    }

    const [currentField, setCurrentField] = useState(convert());

    useEffect(() => {
        setCurrentField(convert());
    }, [currentFields]);

    return (
        <div className="subfield">
            <h4 id={field.type} className="read-my-type">{field.label}</h4>
            <textarea 
                key={currentField[field.label]}
                id={field.label}
                className={'read-my-value'}
                style={{resize: "vertical", height: '150px'}}
                defaultValue={currentField[field.label]} />
        </div>
    )
}

const RichTextField = ({currentFields, field}) => {

    const textAreaRef = useRef();

    const convert = () => {
        return {
            type: 'rich-text',
            [field.label]: getCurrentField(currentFields, field)[field.label],
        }
    }

    const [currentField, setCurrentField] = useState(convert());

    useEffect(() => {
        setCurrentField(convert());
    }, [currentFields]);

    // console.log("intiailizing rte with:", currentField[field.label]);

    return (
        <div className="subfield">
            <h4 id={field.type} className="read-my-type">{field.label}</h4>
            
            {/* Store the contents of the text editor here invisibly. */}
            <textarea 
                id={field.label} 
                style={{display: 'none'}} 
                className="read-my-value" 
                defaultValue={currentField[field.label]}
                ref={textAreaRef} 
            />
            <TextEditor 
                initialValue={currentField[field.label]}
                value={RichTextEditor.createValueFromString(currentField[field.label], 'html')}
                onChange={(val) => {
                    // console.log('field richtext updated', val);
                    textAreaRef.current.value = val;
                }} 
            />
        </div>
    )
}

const TextField = ({currentFields, field}) => {

    const convert = () => {
        return {
            type: "text",
            [field.label]: getCurrentField(currentFields, field)[field.label],
        }
    }

    const [currentField, setCurrentField] = useState(convert());

    useEffect(() => {
        setCurrentField(convert());
    }, [currentFields]);

    return (
        <div className="subfield">
            <h4 id={field.type} className="read-my-type">{field.label}</h4>
            <input 
                key={currentField[field.label]}
                id={field.label}
                className={styles.svg_wrapper_inner + " read-my-value"} 
                // value={currentField.text}
                defaultValue={currentField[field.label]} />
        </div>
    )
}

// Why does saving not change the value? But changing product does...hmm...
const CountTotal = ({currentFields, field}) => {
    // console.log('currentField: ', currentFields);
    // console.log("field: ", field);

    const [currentField, setCurrentField] = useState(getCurrentField(currentFields, field));
    // console.log("currentField: ", currentField);
    useEffect(()=>{ 
        setCurrentField(getCurrentField(currentFields, field));
    }, [currentFields]);

    return (
        <div className="Count_Total subfield">
            <h4 id={field.type} className="read-my-type">{field.label}</h4>
            <input key={currentField.amount} id="amount" className="read-my-value" defaultValue={currentField.amount} type="number" />
            <label htmlFor="count_total-total">out of: </label>
            <input key={currentField.total} id="total" className="read-my-value" defaultValue={currentField.total} type="number" />
        </div>
    )
}

const Slug = ({currentFields, field}) => {

    const convert = () => {
        return {
            type: "slug",
            [field.label]: getCurrentField(currentFields, field)[field.label],
        }
    }

    const [currentField, setCurrentField] = useState(
        convert()
    );

    useEffect(() => {
        setCurrentField(convert());
    }, [currentFields]);

    return (
        <div className={"Slug subfield "}>
            <label id={field.type} className="read-my-type">{field.label}</label>
            <input 
                key={currentField[field.label]}
                id={field.label}
                className={styles.svg_wrapper_inner + " read-my-value"} 
                defaultValue={currentField[field.label]}
                //defaultValue="/" 
                />
        </div>
    );
}

const OnOff = ({currentFields, field}) => {
    
    const convert = () => {
        return {
            type: "on/off",
            [field.label]: getCurrentField(currentFields, field)[field.label] === "true"
        }
    }
    
    const [currentField, setCurrentField] = useState(
        convert()
    );
    
    useEffect(()=>{ 
        setCurrentField(convert());
    }, [currentFields]);

    // useEffect(()=>{
    //     console.log(currentField);
    // }, [currentField]);

    return (
        <div className={"On_Off subfield " + styles.date_wrapper}>
            <div className={styles.svg_wrapper} onClick={(e)=>{
                // var cf = currentField.on;
                // if(cf === "true") {
                //     cf = false;
                // } else {
                //     cf = true;
                // }
                // console.log(currentField.on);
                setCurrentField({
                    [field.label]: !currentField[field.label],
                    type: "on/off",
                })
            }}>
                <label id={field.type} className="read-my-type">{field.label}</label>
                <div id={field.label} className={styles.svg_wrapper_inner + " read-my-value " + (currentField[field.label] ? styles.showing : "")} value={currentField[field.label]} >
                {
                    currentField[field.label]
                    ? <Check size={22}/>
                    : <Square size={22}/>
                }
                </div>
            </div>
            {/* <input key={currentField.on} id="on" className="" defaultValue={currentField.on} type="checkbox" /> */}
        </div>
    )
}
