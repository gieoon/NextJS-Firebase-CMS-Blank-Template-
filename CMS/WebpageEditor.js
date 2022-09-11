/* Communicates with client iframe via npm firestore-cms-iframe package. */

import React, { useContext, useEffect, useState } from 'react';
import { Plus, Image, X } from 'react-feather';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { STORAGE_ROOT } from './CMS_Freelance';
import styles from './CMS.module.scss';
import Loading from './Loading';
import { websiteContent as defaultContent} from '../constants';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

// Edits webpages based on a list of id's.
export default function WebpageEditor({
    pageData, 
    projectName,
    email,
}){

    var storage = getStorage();

    const [websiteContent, setWebsiteContent] = useState();
    const [showingImageUploader, setShowingImageUploader] = useState(false);
    const [currentFileId, setCurrentFileId] = useState(undefined);
    const [currentFile, setCurrentFile] = useState({});
    const [showingObjectCreator, setShowingObjectCreator] = useState(false);
    const [currentObj, setCurrentObject] = useState({});
    const [objectFiles, setObjectFiles] = useState({});
    const [loading, setLoading] = useState(true);
    const [showingDeleteDialog, setShowingDeleteDialog] = useState(false);

    useEffect(()=>{
        // Client has built in script that listens to 'highlight' event.
        // This will trigger code.

        // Initial creating data.
        // saveWebsiteContent(defaultContent);

        loadWebsiteContent().then(d => {
            setWebsiteContent(d);
        })

        window.addEventListener('message', receiveMessage, false);
        // var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        // var eventer = window[eventMethod];
        // var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        // eventer(messageEvent, (evt) => {
        //     console.log('PARENT RECEIVED MESSAGE!: ', evt);
        //     receiveMessage(evt);
        // }, false);
        return () => {
            window.removeEventListener('message', receiveMessage);
        }

    }, [projectName]);

    useEffect(()=>{
        // Need to reset this because click listener doesn't hold latest state data.
        window.removeEventListener('message', receiveMessage);
        window.addEventListener('message', receiveMessage, false);
    }, [websiteContent]);

    // Receive message from embedded iframe.
    const receiveMessage = (evt) => {
        // console.log('PARENt RECEIVED MESSAGE: ', evt);
        // if(evt.origin !== pageData.liveURL){
        //     console.log('Wrong origin: ', evt.origin, pageData.liveURL);
        //     return;
        // }
        
        if(evt.data.actionType === "finishedEdit"){
            setLoading(true);
            const tWebsiteContent = websiteContent;
            if(!tWebsiteContent) return;
            
            // Modifies dbObj by reference.
            createNestedObj(tWebsiteContent, evt.data.sections, evt.data.val);
            console.log('tWebsiteContent: ', tWebsiteContent);

            saveWebsiteContent(tWebsiteContent);
            setWebsiteContent(tWebsiteContent);
        }
        // Image was saved, check to save it or not.
        else if(evt.data.actionType === "editFile"){
            // Check if should save to storage or not.
            // Save to storage
            // Update websiteContent.
            console.log("editFile: ", websiteContent, evt.data);
            if(!websiteContent) return;
            setShowingImageUploader(true);
            setCurrentFileId(evt.data.identifier);
            var sections = evt.data.identifier.split(/-|~/g);
            setCurrentFile(getResultFromSections(sections));
            // if(!tWebsiteContent) return;
        }
        else if(evt.data.actionType === "addToArray"){
            console.log('Received event: ', evt.data);
            if(!websiteContent) return;
            // Identify exact location if it is an image file.


            setShowingObjectCreator(true);
            setCurrentObject(evt.data);
            // console.log('websiteContent: ', websiteContent);
            // console.log('getResultFromSections(evt.data.sections): ', )
            // var i = getResultFromSections(evt.data.sections).length;
            // setCurrentFile({id:""});
        }
        else if(evt.data.actionType === "removeFromArray"){
            console.log('Received event: ', evt.data);
            if(!websiteContent) return;
            
            const cb = (evt) => {
                setLoading(true);
                var v = getResultFromSections(evt.data.sections);
                console.log('v: ', v, evt.data.index, v[evt.data.index]);
                // Check if there is a file to delete.
                // Check directly by reading from the templates and looking for a url field.
                for(var field of Object.keys(v[evt.data.index] || {})){ //evt.data.obj
                    // If .url field exists, it is a file, and delete it.
                    if(v[evt.data.index][field].url){
                        deleteStoredObject(v[evt.data.index][field].url);
                    }
                }
                v.splice(evt.data.index, 1);
                console.log('Array after remove: ', v);
                var tWebsiteContent = websiteContent;
                createNestedObj(tWebsiteContent, evt.data.sections, v);
                setWebsiteContent(tWebsiteContent);
                setCurrentObject({});
                setObjectFiles({});
                saveWebsiteContent(tWebsiteContent).then(()=>{
                    // Notify child to update array.
                    document.querySelector('iframe').contentWindow.postMessage({
                        actionType: "updateArray",
                        identifier: evt.data.identifier,
                        sections: evt.data.sections,
                        newWebsiteContent: tWebsiteContent,
                    }, '*');
                })
            }
            setShowingDeleteDialog({
                file: evt,
                cb: cb,
            });
        }
    }

    const getResultFromSections = (sections) => {
        var out = websiteContent;
        console.log("sections: ", sections)
        for(var section of sections){
            out = out[section];
        }
        console.log("out: ", out)
        return out;
    }

    // Dynamically updates a nested field in an object.
    // Modifies dbObj by reference, so return is empty when exiting recursive loop.
    const createNestedObj = (obj, path, value) => {
        if (path.length === 1) {
            obj[path] = value
            return;
        }
        try {
            return createNestedObj(obj[path[0]], path.slice(1), value);
        } catch(err){
            console.error("Caught error creating nested object: ", err);
            return obj;
        }
    }

    // Copy from CMS_Freelance (Should move this to helper class)
    const saveImage = async (fileObj, identifier) => {
        // This has already been saved.
        if(!fileObj.localFile) {
            return {
                url: fileObj.url, 
                path: fileObj.path
            }
        }
        const metaData = {
            customMetadata: {
                "uploader": email || ""
            }
        }
        const path = getStoragePath('websiteContent', identifier, fileObj.name);
        console.log("path: ", path, fileObj);
        var storageRef = ref(getStorage(), path);
        return uploadBytes(storageRef, fileObj.localFile, metaData).then(snapshot => {
            console.log("Uploaded Image");
            return getDownloadURL(snapshot.ref).then(url => {
                console.log("Got downloadURL: ", url, path);
                return {url, path};
            })
        }).catch(err => console.error("Error saving file: ", err))
    }

    const getStoragePath = (type, identifier, filename) => {
        return projectName + "/" + type + "/" + identifier + "/" + filename;
    }

    const loadWebsiteContent = async () => {
        const db = getFirestore();
        const docRef = doc(db, 'CMS_WebsiteContent', projectName);
        return await getDoc(docRef)
            .then(doc => {
                return doc.data();
            })
            .catch(err => console.error("Error loading website content: ", err))
    };

    const saveWebsiteContent = async (obj) => {
        const db = getFirestore();
        const docRef = doc(db, 'CMS_WebsiteContent', projectName);
        setDoc(docRef, obj, {merge: true})
            .then(() => {
                console.log('Successfully saved website content');
                setLoading(false);
                return "Success";
            })
            .catch(err => console.error("Error saving website content: ", err))
    };

    const iframeLoadComplete = () => {
        console.log('IFRAME loaded, Sending data to client: ', websiteContent);
        const iframe = document.querySelector('iframe').contentWindow;
        const d = {
            actionType: 'startEdit',
            websiteContent: websiteContent,
        };
        iframe.postMessage(d, '*' /*window.location.href*/);

        iframe.postMessage({actionType: "initEditing",}, '*');
        setLoading(false);
    }

    const cancelImageClicked = (e) => {
        // var parentElement = e.target.parentElement.previousElementSibling;
        // parentElement.classList.toggle('editing');
        // document.getElementById(currentFileId).classList.toggle('editing');
        setCurrentFile({});
        setCurrentFileId(undefined);
        setShowingImageUploader(false);
        document.querySelector('iframe').contentWindow.postMessage({
            actionType: "cancelSaveFile",
        }, '*');
    }

    const saveImageClicked = () => {
        setLoading(true);
        // var parentElement = e.target.parentElement.previousElementSibling;
        // parentElement.classList.toggle('editing');
        
        // Update local DOM
        var sections = currentFileId.split(/-|~/g);

        console.log('SENDING Save Image: ', sections, currentFile);
        if(!currentFile || !Object.values(currentFile).length) {
            setShowingImageUploader(false);
            return;
        }

        saveImage(currentFile, currentFileId).then(obj => {
            var out = {
                url: obj.url,
                path: obj.path,
                id: currentFile.id,
                name: currentFile.name,
                identifier: currentFileId,
            }
            const tWebsiteContent = websiteContent;
            createNestedObj(tWebsiteContent, sections, out);
            console.log('Updated object to save: ', tWebsiteContent, sections, currentFile);
            saveWebsiteContent(tWebsiteContent);
            setWebsiteContent(tWebsiteContent);
            setCurrentFile({}/*out*/);
            setShowingImageUploader(false);
            // Notify client to update with new website content.
            document.querySelector('iframe').contentWindow.postMessage({
                actionType: "updateElement",
                identifier: currentFileId,
                file: out,
            }, '*');
            setLoading(false);
        })
    }

    const updateWebsiteContent = (file) => {
        // console.log('Updating element: ', file);
        if(!file.identifier) return;
        const tWebsiteContent = websiteContent;
        // Changing an image inside of an array doesn't work. Just makes the whole array an empty object.
        createNestedObj(tWebsiteContent, file.identifier.split(/-|~/g), {});
        // console.log("tWebsiteContent: ", tWebsiteContent);

        saveWebsiteContent(tWebsiteContent);

        document.querySelector('iframe').contentWindow.postMessage({
            actionType: "updateElement",
            identifier: file.identifier,
            file: {url:""},
        }, '*');
    }

    const onFileAdded = (e) => {
        var file = e.target.files[0];
        console.log("file added: ", file);
        if(file && e.target.files.length){
            setCurrentFile({
                id: Date.now().toString(),// For deletion
                downloadUrl: URL.createObjectURL(file),
                url: URL.createObjectURL(file),
                fileType: file.type,
                name: file.name,
                localFile: file,
            });
        }
    }

    const onObjectFileRemoved = (id) => {
        var tObjectFiles = objectFiles;
        tObjectFiles[id] = {};
        delete tObjectFiles[id];
        setObjectFiles({...tObjectFiles});
    }

    const onObjectFileAdded = (id, e) => {
        var file = e.target.files[0];
        console.log(id, file);
        if(file && e.target.files.length){
            var tObjectFiles = objectFiles;
            tObjectFiles[id] = {
                id: id,// For deletion
                downloadUrl: URL.createObjectURL(file),
                url: URL.createObjectURL(file),
                fileType: file.type,
                name: file.name,
                localFile: file,
            };
            console.log('tObjectFiles: ', tObjectFiles);
            setObjectFiles({...tObjectFiles});
        }
    }

    // Dynamically render object
    const renderObject = (o) => {
        console.log('Rendering: ', o)
        switch(o.type){
            case 'span':
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                return <div className={styles.basic_render}>
                    <label htmlFor={o.value}>{o.value}</label>
                    <input id={o.value} className={styles.render_obj} />
                </div>
            case 'li':
            case 'p':
                return <div className={styles.basic_render}>
                    <label htmlFor={o.value}>{o.value}</label>
                    <textarea id={o.value} className={styles.render_obj} />
                </div>
            case 'img':
            case 'video':
                console.log(currentFile);
                return (
                    <>
                        <ObjectFileObj 
                            id={o.value}
                            file={objectFiles[o.value]}
                            placeholder="Your image"
                            accept="image/*,video/*"
                            onObjectFileAdded={onObjectFileAdded} 
                            onObjectFileRemoved={onObjectFileRemoved}
                            updateWebsiteContent={updateWebsiteContent}
                            setShowingDeleteDialog={setShowingDeleteDialog}
                            setLoading={setLoading}
                        />
                        {/* <div className="bottom-wrapper">
                            <div onClick={()=>{cancelImageClicked()}}>Cancel</div>
                            <div onClick={()=>{saveImageClicked()}}>Save</div>
                        </div> */}
                    </>
                );
            default: return <></>;
        }
    }

    return(
        <div className={styles.WebpageEditor} style={{height: "100vh"}}>
            <div className={styles.firestore_cms_iframe}>
                {/* Create objects in an array */}
                <div className={styles.ObjectCreator + " " + (showingObjectCreator ? styles.showing : "")}>
                    <div className={styles.cp_overlay} onClick={(e)=>{
                        // console.log(e.target);
                        if(e.target.classList.contains(styles.cp_overlay)){
                            setShowingObjectCreator(false);
                            setCurrentObject({});
                        }
                    }}>
                        <div className={styles.close} onClick={()=>{
                                console.log('close clicked');
                                setShowingObjectCreator(false);
                                setCurrentObject({});
                            }}>
                            <X />
                        </div>
                        <div className={styles.cp_inner}>
                            <div className={styles.title_wrapper}>
                                <h2>Add new</h2>
                            </div>
                            <div className={styles.cp_content}>
                                {
                                    (currentObj.obj || []).map((o, i) => (
                                        <div className="" key={"object-"+i}>
                                            {renderObject(o)}
                                        </div>
                                    ))
                                }
                                <div className={styles.plus_wrapper} onClick={async (e)=>{
                                    var tWebsiteContent = websiteContent;
                                    console.log(currentObj);
                                    var v = getResultFromSections(currentObj.sections);
                                    console.log("v: ", v);
                                    console.log(e.target);
                                    setLoading(true);
                                    // To bypass synthetic event issue with asynchronous onclick event.
                                    const el = e.target;
                                    var out = {};
                                    for(var o of currentObj.obj){
                                        console.log('handling: ', o.value);
                                        // Check if it is an image, and use that file, otherwise use standard way to get object data.
                                        if(objectFiles[o.value]){
                                            // Modify identifier to be exact location.
                                            // Array index + field name.
                                            currentObj.identifier = currentObj.identifier + "-" + v.length + "-" + o.value;
                                            const obj = await saveImage(objectFiles[o.value], currentObj.identifier);
                                            out[o.value] = {
                                                url: obj.url,
                                                path: obj.path,
                                                id: objectFiles[o.value].id,
                                                name: objectFiles[o.value].name,
                                                identifier: currentObj.identifier,
                                            }
                                        }
                                        else {
                                            out[o.value] = el.closest(`.${styles.cp_inner}`).querySelector("#" + o.value).value;
                                        }
                                    }
                                    v.push(out);
                                    console.log(out, v);
                                    createNestedObj(tWebsiteContent, currentObj.sections, v);
                                    console.log('Saving ', tWebsiteContent);
                                    updateWebsiteContent(tWebsiteContent);
                                    saveWebsiteContent(tWebsiteContent).then(()=>{
                                        setShowingObjectCreator(false);
                                        setObjectFiles({});
                                        setCurrentObject({})
                                        // Notify child to update array.
                                        document.querySelector('iframe').contentWindow.postMessage({
                                            actionType: "updateArray",
                                            // identifier: evt.data.identifier,
                                            // sections: evt.data.sections,
                                            // newWebsiteContent: tWebsiteContent,
                                        }, '*');
                                        setLoading(false);
                                    })
                                }}>
                                    {/* <Plus size={20}/> */}
                                        Save
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.ImageUploader + " " + (showingImageUploader ? styles.showing : "")}>
                    <div className={styles.cp_overlay} onClick={(e)=>{
                        console.log(e.target);
                        if(e.target.classList.contains(styles.cp_overlay)){
                            setShowingImageUploader(false);
                            setCurrentFile({});
                            setCurrentFileId(undefined);
                        }
                    }}>
                        <div className={styles.cp_inner}>
                            <FileObj 
                                id={currentFileId} //currentFile.id}
                                file={currentFile}
                                placeholder="Your image"
                                accept="image/*,video/*"
                                onFileAdded={onFileAdded} 
                                setCurrentFile={setCurrentFile}
                                updateWebsiteContent={updateWebsiteContent}
                                setShowingDeleteDialog={setShowingDeleteDialog}
                                setLoading={setLoading}
                            />
                            <div className={styles.bottom_wrapper}>
                                <div onClick={()=>{cancelImageClicked()}}>Cancel</div>
                                <div onClick={()=>{saveImageClicked()}}>Save</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* TODO set this to LiveURL */}
            {/* <iframe src={pageData.liveURL} onLoad={()=>{iframeLoadComplete()}} width="100%" height="100%" title="Client Website" /> */}
            <iframe src={
                /*"https://rotary-nelson-website.vercel.app"*/
                pageData.devURL
            } onLoad={()=>{iframeLoadComplete()}} width="100%" height="100%" title="Client Website" onError={(e) => console.error("Error loading client iframe: ", e)} />

            <Loading loading={loading} />
            <DeleteDialog showingDeleteDialog={showingDeleteDialog} setShowingDeleteDialog={setShowingDeleteDialog} />
        </div>
    )
}

const DeleteDialog = ({
    showingDeleteDialog,
    setShowingDeleteDialog,
}) => {
    return (
        <>
            <div className={styles.overlay + " " + (showingDeleteDialog ? styles.showing : "")} onClick={()=>{setShowingDeleteDialog(false)}} />
            <div className={styles.deleteDialog + " " + (showingDeleteDialog ? styles.showing : "")}>
                <h4>Are you sure you want to delete this?</h4>
                <div className={styles.options_wrapper}>
                    <div className={styles.cancel} onClick={()=>{setShowingDeleteDialog(false);}}>
                        <span>Cancel</span>
                    </div>
                    <div className={styles.ok} onClick={()=>{
                        console.log("Deleting file: ", showingDeleteDialog);
                        showingDeleteDialog.cb(showingDeleteDialog.file);

                        setShowingDeleteDialog(false);
                    }}>
                        <span>Ok</span>
                    </div>
                </div>
            </div>
        </>
    )
}

const ObjectFileObj = ({
    id,
    file,
    help,
    placeholder,
    accept,
    onObjectFileAdded,
    onObjectFileRemoved,
    updateWebsiteContent,
    setShowingDeleteDialog,
    setLoading,
}) => {
    console.log('rendering file: ', file);
    return(
        <div className={styles.fileObj}>
            <p className={styles.description}>{help}</p>
            { !file || !file.url
                ? <>
                    <label htmlFor={/*"file-upload"*/id}>
                        <div className={styles.image_upload_wrapper}>
                            <h2>Upload an image</h2>
                            <Image size="22"/>
                        </div>
                    </label>
                    <input id={id} 
                        type="file"
                        onChange={(e) => {onObjectFileAdded(id, e)}} 
                        hidden={true} 
                        defaultValue={""} 
                        placeholder={placeholder} 
                        accept={accept} 
                        onClick={(e)=>{console.log('CLICKED'); e.target.value = ""}} 
                        className={styles.file_input} 
                    />
                </>
                : <></>
            }
            { file && file.url
                ? <div className={styles.media_wrapper}>
                    <div className={styles.img_wrapper} key={"img-"+id}>
                        { file.fileType && file.fileType.includes('video/')
                            ? <video className={styles.uploaded_img} controls src={file.url} type="video/*" autoPlay={true} muted={true} />
                            : <LazyLoadImage className={styles.uploaded_img} src={file.url} effect="blur" alt="" />
                        }
                        {/* <input id={id} hidden={true}  */}
                        <div className={styles.close} onClick={()=>{
                            console.log("file.url: ", file.url);
                            onObjectFileRemoved(id);
                            // Don't delete if local only.
                            if(!(file.url || "").includes(STORAGE_ROOT)){
                                // const t_objectFiles = objectFiles;
                                // delete t_objectFiles[file.id];
                                // setObjectFiles({...t_objectFiles});
                                return;
                            }
                            const cb = (file) => {
                                setLoading(true);
                                console.log("Deleting file: ", file);
                                deleteStoredObject(file.url);
                                
                                updateWebsiteContent(file);
                                setLoading(false);
                            }
                            setShowingDeleteDialog({
                                file: file,
                                cb: cb,
                            });
                        }}>
                            <X />
                        </div>
                    </div>
                </div>
                : <></>
            }
        </div>
    );
}

const FileObj = ({
    id,
    file,
    placeholder,
    help,
    accept,
    onFileAdded,
    setCurrentFile,
    updateWebsiteContent,
    setShowingDeleteDialog,
    setLoading,
}) => {
    // console.log('FileObj: ', id, file)
    return(
        <div className={styles.fileObj}>
            <p className={styles.description}>{help}</p>
            { !file || !file.url
                ? <>
                    <label htmlFor={'file_upload'/*id*/}>
                        <div className={styles.image_upload_wrapper}>
                            <h2>Upload an image</h2>
                            <Image size="22"/>
                        </div>
                    </label>
                    {/* <input id="file-upload" type="file" onChange={onFileAdded} hidden={true} accept="application/pdf,application/msword,text/plain,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onClick={(e)=>{e.target.value = ""}} /> */}
                    <input id={'file_upload'}//id={id} 
                        type="file"
                        onChange={(e) => {onFileAdded(e)}} 
                        hidden={true} 
                        defaultValue={""} 
                        placeholder={placeholder} 
                        accept={accept} 
                        onClick={(e)=>{console.log('CLICKED'); e.target.value = ""}} 
                        className={styles.file_input} 
                    />
                </>
                : <></>
            }
            { file && file.url
                ? <div className={styles.media_wrapper}>
                    <div className={styles.img_wrapper} key={"img-"+id}>
                        { file.fileType && file.fileType.includes('video/')
                            ? <video className={styles.uploaded_img} controls src={file.url} type="video/*" autoPlay={true} muted={true} />
                            : <LazyLoadImage className={styles.uploaded_img} src={file.url} effect="blur" alt="" />
                        }
                        <div className={styles.close} onClick={()=>{
                            // console.log('Sending file deletion request to parent');
                            // window.parent.postMessage({
                            //     actionType: "deleteStoredObj",
                            //     id: id, 
                            //     url: file.url, 
                            // }, '*');
                            const cb = (file) => {
                                setLoading(true);
                                console.log("Deleting file: ", file);
                                deleteStoredObject(file.url);
                                setCurrentFile({});
                                updateWebsiteContent(file);
                            }
                            setShowingDeleteDialog({
                                file: file,
                                cb: cb,
                            });
                        }}>
                            <X />
                        </div>
                    </div>
                </div>
                : <></>
            }
        </div>
    )
}

const deleteStoredObject = (downloadUrl) => {
    // Only delete if the url is to an existing file
    if(!(downloadUrl || "").includes(STORAGE_ROOT)){
        return;
    }

    //getStorage()
    deleteObject(ref(getStorage(), downloadUrl)).then(()=>{
        console.log('Deleted successfully: ', downloadUrl);
    }).catch(err => {
        console.error("Error deleting stored item");
    }) 
}
