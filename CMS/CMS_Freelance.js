// Client-facing CMS
// Client navigates to their webpage, then to /edit, then they can update the content as they wish.

// Google Tag Manager layout.

import React, {useState, useEffect, useCallback, useContext} from 'react';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from '@firebase/storage';
import { Minus, Check, CheckSquare, Square, Plus, X, Edit, Trash2, Image, Headphones, File, Paperclip } from 'react-feather';
import profile from './profile.png';
// import blank_image from '../assets/blank_image.png';
// import blank_audio from '../assets/blank_audio.png';
import styles from './CMS.module.scss';
import Loading from './Loading';
import TextEditor from './TextEditor.js';
import RichTextEditor from 'react-rte';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import WebpageEditor from './WebpageEditor.js';
import FieldsDisplay from './FieldsDisplay';
import Head from 'next/head';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from '@firebase/auth';
import { collection, deleteDoc, doc, getDoc, updateDoc, getDocs, getFirestore, onSnapshot, orderBy, query, setDoc, serverTimestamp } from 'firebase/firestore';
// import { GlobalContext } from '../../context/GlobalContextProvider';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import { Document, Page } from 'react-pdf';
// import { pdfjs } from 'react-pdf';
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const STORAGE_ROOT = 'https://firebasestorage.googleapis.com';

const firebaseDate2DisplayDate = (d) => {
    const tz = Intl.DateTimeFormat().resolvedOptions()//.timeZone;
    // if(!firebaseDate) return "";
    // console.log(firebaseDate);
    // If seconds, convert into milliseconds 
    // if (firebaseDate.seconds.toString().length <= 10) {
    //     firebaseDate.seconds += "000";
    // }
    const out = new Date(d).toLocaleDateString(tz.locale); //"en-nz"
    return out;
}

// Convert to standardized {seconds: } format
const date2FirebaseServerTimestamp = (date) => {
    var timestamp = date.getTime()
    return {seconds: Math.round(timestamp / 1000).toString()};
}

export default function CMS_Freelance({
    projectName,
}){
    // console.log("CMS_FREELANCE: ", projectName);
    
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");
    // const {setUser} = useContext(GlobalContext);

    const [_projectName, setProjectName] = useState(projectName);
    
    const [loginComplete, setLoginComplete] = useState(false);
    const [currentUid, setCurrentUid] = useState();
    const [currentUser, setCurrentUser] = useState({});
    const [currentEmail, setCurrentEmail] = useState("");
    const [currentSection, setCurrentSection] = useState({name:""});
    const [pageData, setPageData] = useState({sections:[]});
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
    const [showingNew, setShowingNew] = useState(false);
    const [newText, setNewText] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [newDate, setNewDate] = useState(new Date());//useState(undefined);
    const [showSaving, setShowSaving] = useState(false);
    const [showingEdit, setShowingEdit] = useState(undefined);
    const [showingDeleteDialog, setShowingDeleteDialog] = useState(false);
    const [newFields, setNewFields] = useState([]);

    const [webpageEditable, setWebpageEditable] = useState(false);
    /* Every website has different types of fields to display,
        e.g. true/false,
        e.g. Price
        e.g. N out of N
        e.g. Inventory Items left (Single number)
        Each field has a type (the above) and a label (What is displayed to the end user)
    */
    const [sections, setSections] = useState([]);

    const [newImages, setNewImages] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [newAudio, setNewAudio] = useState([]);

    const [rteInitTitle, setRteInitTitle] = useState();
    const [rteInitContent, setRteInitContent] = useState();

    const [showingAdditionalDate, setShowingAdditionalDate] = useState(false);
    const [additionalDate, setAdditionalDate] = useState(new Date());
    const [orderInList, setOrderInList] = useState([]);

    const [editType, setEditType] = useState(0);

    const [storage, setStorage] = useState();

    useEffect(()=>{
        
        const auth = getAuth();

        if(!currentUid){            
            setStorage(getStorage());
            
            var provider = new GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
            onAuthStateChanged(auth, function(user) {
                console.log("Updating user: ", user);
                if (user) {
                    // User is signed in.
                    // var displayName = user.displayName;
                    // var email = user.email;
                    // var emailVerified = user.emailVerified;
                    // var photoURL = user.photoURL;
                    // var isAnonymous = user.isAnonymous;
                    // var uid = user.uid;
                    // var providerData = user.providerData;
                    // console.log('Login complete: ', user.email);
                    setCurrentEmail(user.email);
                    setCurrentUser(user);
                    // setUser(user);
                    // console.log(user);
                    // console.log(user);
                    setLoginComplete(true);
                    setCurrentUid(user.uid);
                } else {
                    // console.log('Not signed in');
                    setLoginComplete(true);
                    // setUser({});
                    setCurrentUid("");
                    setCurrentUser("");
                    setCurrentEmail("");
                }   
            });

            // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            // .then(()=>{
            //     firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            //         var errorCode = error.code;
            //         var errorMessage = error.message;
            //     });
            // })
        }

    }, []);

    // useEffect(()=>{
    //     setNewTitle("");
    //     setNewText("");
    // }, showingNew);

    const LogIn = () => {
        var provider = new GoogleAuthProvider();
        // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        signInWithPopup(getAuth(), provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // var token = result.credential.accessToken;
            // var user = result.user;
            // setCurrentUid(user.uid);
            // setCurrentUser(user);
            // setCurrentEmail(user.email);
            // setLoginComplete(true);
          }).catch(function(err) {
            // Handle Errors here.
            // var errorCode = error.code;
            // var errorMessage = error.message;
            // // The email of the user's account used.
            // var email = error.email;
            // // The firebase.auth.AuthCredential type that was used.
            // var credential = error.credential;
            console.error("Error signing in: ", err);
          });
    }

    useEffect(()=>{
        // DB calls to load data to edit
        // console.log('Initializing CMS data: ', currentUid, _projectName);
        if(currentUid){
            authTest();
            init();
        }
    }, [loginComplete, currentUid, _projectName])

    // Try and set some dummy data to check if it's possible
    const authTest = () => {
        const db = getFirestore();
        const docRef = doc(db, 'CMS', _projectName);
        
        updateDoc(docRef, {
            lastLogin: serverTimestamp(),
        }, {merge: true}
        )
        .then((e) => {
            // console.log("authTest SUCCESS");
        })
        .catch(err => {
            console.error("Error in authTest: ", err);
            
            getAuth().signOut();
        });        
        
    }

    const init = () => {
        
        loadWebpageDataFromUid().then(pageData => {
            if(!pageData && loginComplete){
                getAuth().signOut();
                return;
            }
            if(!pageData || !pageData.sections)
                return;

            setPageData(pageData || {})
            setWebpageEditable(pageData.webpageEditable);
            if (pageData.webpageEditable) setEditType(0);
            else setEditType(1);

            loadAllSectionData(pageData || {}).then(d => {
                // console.log(d)
                // setPageData({
                //     ...pageData, 
                //     ...d
                // })
            })
            // Default to first section
            if(pageData) setCurrentSection(pageData.sections[0] || "");
        });
    }

    const loadWebpageDataFromUid = async () => {
        if(!loginComplete) return;
        const db = getFirestore();
        // console.log("_projectName: ", _projectName)
        const docRef = doc(db, 'CMS', _projectName);
        // console.log('docRef: ', docRef.path)
        const docSnapshot = await getDoc(docRef);
        // console.log('data: ', docSnapshot.data());
        return docSnapshot.data() || {};
            // .then(doc => {
            //     console.log("doc: ", doc.data())
            //     return doc.data() || [];
            // })
            // .catch(err => {
            //     console.error("Error reading user data: ", err);
            //     return undefined;
            // })
    }

    // useEffect(()=>{
    //     loadAllSectionData();
    //     console.dir(pageData)
    // }, [pageData]);

    // const forceUpdate = useCallback(()=>{
    //     updatePageData({});
    // }, []);

    // const [, updatePageData] = useState();

    const loadAllSectionData = async (data) => {
        // console.log(data)
        if(!data.sections) return;
        setSections(data.sections);
        const promises = [];
        const out = {};
        data.sections.forEach((section) => {
            promises.push(
                loadSectionData(section.name, data).then(d => {
                    out[section.name] = d;
                })
            );
        })
        
        return Promise.all(promises).then(()=>{
            return out;
        });
    }

    const loadSectionData = async (sectionName, data) => {
        const db = getFirestore();
        
        const q = query(collection(db, 'CMS', _projectName, sectionName), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const p = data;
                if(!p[sectionName]) p[sectionName] = {};
                if(change.type === 'added' || change.type === 'modified'){
                    // Backcompatibility converting old imageURL/audioURL into array of objects
                    const out = change.doc.data();
                    if(out.imageURL){
                        out.images = [
                            {
                                id: Date.now().toString(),
                                url: out.imageURL,
                                path: "",
                                name: "",
                            }
                        ]
                    }
                    if(out.audioURL){
                        out.audio = [
                            {
                                id: Date.now().toString(),
                                url: out.audioURL,
                                name: "",
                                path: "",
                            }
                        ]
                    }
                    p[sectionName][change.doc.id] = {...out, id: change.doc.id};
                    // console.log('change.doc.data: ', change.doc.data());
                    // console.log('added new: ', p.sections, p);
                }
                else if(change.type === 'removed'){
                    delete p[sectionName][change.doc.id];
                }
                
                setPageData({...p});
                // forceUpdate();
            })
        });
    }

    const saveImage = async (fileObj) => {
        if(!fileObj.localFile) {
            return {
                url: fileObj.url, 
                path: fileObj.path
            }
        }
        const metaData = {
            customMetadata: {
                "uploader": currentEmail
            }
        }
        const path = getStoragePath('images', fileObj.name);
        var storageRef = ref(getStorage(), path);
        return uploadBytes(storageRef, fileObj.localFile, metaData).then(snapshot => {
            console.log("Uploaded Image");
            return getDownloadURL(snapshot.ref).then(url => {
                console.log("Got download URL: ", url, path);
                return {url, path};
            })
        })
    }

    const saveAudio = async (fileObj) => {
        if(!fileObj.localFile) {
            return {
                url: fileObj.url, 
                path: fileObj.path
            }
        }
        const metaData = {
            customMetadata: {
                "uploader": currentEmail
            }
        }
        const path = getStoragePath('audio', fileObj.name);
        var storageRef = ref(getStorage(), path);
        return uploadBytes(storageRef, fileObj.localFile, metaData).then((snapshot) => {
            console.log('Uploaded Audio');
            return getDownloadURL(snapshot.ref).then(url => {
                return {url, path};
            })
        })
        .catch(err => {
            console.error("Error saving audio: ", err);
        })
    }

    const saveMiscellaneous = async (fileObj) => {
        // If local file exists, it means it has been freshly uploaded and needs to be saved, 
        // Otherwise it has already been saved and can be ignored
        if(!fileObj.localFile) {
            return {
                url: fileObj.url, 
                path: fileObj.path
            };
        }

        const metaData = {
            customMetadata: {
                "uploader": currentEmail
            }
        }

        const path = getStoragePath('miscellaneous', fileObj.name);
        console.log('saving fileObj: ', fileObj);
        var storageRef = ref(getStorage(), path);
        return uploadBytes(storageRef, fileObj.localFile, metaData).then((snapshot) => {
            console.log('Uploaded miscellaneous');
            return getDownloadURL(snapshot.ref).then(url => {
                console.log("Got URL: ", url);
                return {url, path};
            })
        })
        .catch(err => {
            console.error("Error saving miscellaneous: ", err);
        })
    }

    const getStoragePath = (type, filename) => {
        // return currentEmail + "/" + type + "/" + Date.now() + "-" + filename;
        // Remove the date from here, looks ugly.
        //return currentEmail + "/" + type + "/" + filename;
        return _projectName + "/" + type + "/" + filename;
    }

    // Saves new article, or news item, etc.
    const saveNew = async () => {
        // Hack to trigger state change and refresh TextEditor
        setShowSaving(true);
        setRteInitTitle("_"/*"Saving..."*/);
        setRteInitContent("_"/*"Saving..."*/);
        let sectionName = pageData.sections[selectedSectionIndex].name;
        
        // Only save to storage if not already saved, determined by checking to see if it is local link.
        var imgObjs = [];
        const blobImgMap = {};
        // Map unsaved image 'blob:' link to uploaded link to be able to modify existing inline images that are mapped to blob:
        for(var i=0;i<newImages.length;i++){
            var imgObj = (newImages[i].downloadUrl || "").includes(STORAGE_ROOT)
                ? newImages[i] : await saveImage(newImages[i]);
            imgObjs.push({
                ...imgObj,
                id: newImages[i].id,
                name: newImages[i].name
            });
            blobImgMap[newImages[i].url] = imgObj.url;
        }

        var audioObjs = [];
        for(var i=0;i<newAudio.length;i++){
            var audioObj = (newAudio[i].downloadUrl || "").includes(STORAGE_ROOT)
                ? newAudio[i] : await saveAudio(newAudio[i]);
                audioObjs.push({
                    ...audioObj,
                    id: newAudio[i].id,
                    name: newAudio[i].name
                });
        }

        
        // var imageObj = (newImage.url || "").includes(STORAGE_ROOT) 
        //     ? newImage : await saveImage();
        // var audioObj = (newAudio || "").includes(STORAGE_ROOT) 
        //     ? newAudio : await saveAudio();

        var fileObjs = [];
        for(var i=0;i<newFiles.length;i++){
            var fileObj = (newFiles[i].downloadUrl || "").includes(STORAGE_ROOT)
                ? newFiles[i] : await saveMiscellaneous(newFiles[i]);
            fileObjs.push({
                ...fileObj,
                // downloadUrl: newFiles[i].downloadUrl,
                id: newFiles[i].id,
                name: newFiles[i].name,
            });
        }
        // console.log("imageObj: ", imageObj);
        const d = {};

        // if(imageObj) {
        //     d["imageObj"] = imageObj.url || "";
        //     d['imageObj'] = imageObj.path || "";
        // }
        // if(audioObj) {
        //     d["audioURL"] = audioObj.url || "";
        //     d["audioPath"] = audioObj.path || "";
        // }
        d['images'] = imgObjs || [];
        d['audio'] = audioObjs || [];
        d['files'] = fileObjs || [];

        if(newTitle) d["title"] = newTitle;
        if(newText) d['content'] = newText;
        // testing remove
        // if(newDate.seconds) newDate = new Date(newDate.seconds);
        if(newDate) {
            d['date'] = newDate;//date2FirebaseServerTimestamp(newDate);
        } else {
            d['date'] = new Date().toLocaleDateString('en-CA').toString();
                //date2FirebaseServerTimestamp(new Date());
                //new Date().toLocaleDateString('en-CA').toString();
            
        }
        if(showingAdditionalDate && additionalDate){
            d['additionalDate'] = additionalDate;//date2FirebaseServerTimestamp(newDate);;
        } else {
            d['additionalDate'] = "";
        }
        d['createdOn'] = serverTimestamp();

        // Save all fields
        // These are an array of objects. (section-specific)
        d['fields'] = [];
        Array.from(document.querySelectorAll(".subfield")).forEach(el => {
            // console.log("Processing subfield: ", el);
            // Search through inputs
            var o = {
                // type: el.querySelector('h4').id
                type: el.querySelector('.read-my-type').id,
            };
            Array.from(el.querySelectorAll(".read-my-value")).forEach(el => {
                o[el.id] = (el.value || el.getAttribute('value'));
            });
            // JSON.stringified result.
            Array.from(el.querySelectorAll(".read-my-value-multiple")).forEach(el => {
                o[el.id] = JSON.parse(el.value || el.getAttribute('value'));
            });

            d['fields'].push(o);
        });

        var id = showingEdit 
            ? showingEdit.id 
            : Date.now().toString();
        
        d['orderInList'] = document.querySelector('#orderInList').value || null;
        
        setOrderInList(undefined);
        
        // Replace all blob: url's in content with uploaded urls.
        for (var blobUrl of Object.keys(blobImgMap)) {
            console.log("Replacing blobURL in content: ", blobUrl, ' with: ', blobImgMap[blobUrl]);
            d.content = d.content.replaceAll(blobUrl, blobImgMap[blobUrl]);
        }
        
        console.log('SAVING: ', d);
        // return;

        const db = getFirestore();
        const docRef = doc(db, 'CMS', _projectName, sectionName, id);
        setDoc(docRef, d, { merge: true})
            .then(()=>{
                console.log('Successfully saved entry');
                setShowSaving(false);
                setShowingNew(false);
                setShowingEdit(undefined);
                setRteInitTitle("");
                setRteInitContent("");
                setNewTitle("");
                setNewText("");
                setNewDate(new Date());
                setOrderInList(undefined);
                setAdditionalDate(new Date());
                setNewAudio([]);
                setNewImages([]);
                setNewFiles([]);
                setNewFields([]);
                setShowingAdditionalDate(false);
                // console.log('reset all fields');
            })
            .catch(err => {
                console.error("Error saving new entry: ", err);
                setShowSaving(false);
                setShowingNew(false);
            })
    }

    // useEffect(()=>{
    //     console.log('new title: ', newTitle);
    // }, [newTitle])

    // useEffect(()=>{
    //     console.log('rteInitTitle: ', rteInitTitle);
    // }, [rteInitTitle])

    const updateSelectedSectionIndex = (i) => {
        setCurrentSection(pageData.sections[i]);
        setSelectedSectionIndex(i);
    }

    const onTextChange = (e) => {
        var text = e;//e.target.value;
        setNewText(text);
    }

    const onTitleChange = (e) => {
        // console.log(e);
        // It's directly HTML now
        setNewTitle(e);
        // setNewTitle(e.target.value);
    }

    const onAudioAdded = (e) => {
        // var audio = e.target.files[0];
        // // setNewAudio(URL.createObjectURL(audio));
        // if(audio && e.target.files.length){
        //     setNewAudio(URL.createObjectURL(audio));
        //     setNewAudioFile(audio);
        // }
        var file = e.target.files[0];
        console.log("audio added: ", file);
        if(file && e.target.files.length){
            setNewAudio(
                [...(newAudio || []),
                {
                    id: Date.now().toString(),
                    url: URL.createObjectURL(file),
                    name: file.name,
                    localFile: file,
                }
                ]
            );
        }
    }

    const onImageAdded = (e) => {
        var file = e.target.files[0];
        // console.log("image added: ", file);
        if(file && e.target.files.length){
            setNewImages(
                [...(newImages || []),
                {
                    id: Date.now().toString(),
                    url: URL.createObjectURL(file),
                    name: file.name,
                    localFile: file,
                }
                ]
            );
        }
    }
    // useEffect(()=>{
    //     console.log(newImages)
    // }, [newImages])

    const onFileAdded = (e) => {
        var file = e.target.files[0];
        // console.log("file added: ", file);
        if(file && e.target.files.length){
            setNewFiles(
                [...(newFiles || []),
                {
                    id: Date.now().toString(),// For deletion
                    downloadUrl: URL.createObjectURL(file),
                    name: file.name,
                    localFile: file,
                }
                ]
            );
        }
    }

    // useEffect(()=>{
    //     console.log("newFiles: ", newFiles);
    // }, [newFiles]);

    const onDateAdded = (e) => {
        // console.log(e);
        setNewDate(e);
        // setNewDate(e.target.value);
    }

    const onAdditionalDateAdded = (e) => {
        setAdditionalDate(e);
    }

    const hideShowingNew = () => {
        setShowingEdit(undefined);
        setShowingNew(!showingNew);
        setNewAudio([]);
        setNewImages([]);
        setNewDate(new Date());
        setNewFiles([]);
        setAdditionalDate(new Date());
        setNewTitle("");
        setShowingAdditionalDate(false);
        setNewText("");
        setNewFields([]);
        setRteInitTitle("");
        setRteInitContent("");
        setOrderInList(undefined);
    }

    const removeUploadedImg = (url) => {
        deleteStoredObject('image', url);
        setNewImages(newImages.filter(f => f.url !== url));
    }

    const removeUploadedAudio = (url) => {
        deleteStoredObject('audio', url);
        setNewAudio(newAudio.filter(f => f.url !== url));
    }

    const removeUploadedMiscellaneous = (url) => {
        console.log('removing fileId: ', url);
        console.log("newFiles: ", newFiles);
        deleteStoredObject('miscellaneous', url);
        setNewFiles(newFiles.filter(f => f.url !== url));
    }

    const deleteSectionContent = (entry, projectName, sectionName) => {
        // console.log('deleting all of entry: ', entry)

        if(newImages.length) {
            for(var newFile of newImages){
                // console.log('deleting: ', newFile);
                deleteStoredObject('image', newFile.downloadUrl);
            }
        }

        if(newAudio.length) {
            for(var newFile of newAudio){
                // console.log('deleting: ', newFile);
                deleteStoredObject('audio', newFile.downloadUrl);
            }
        }
        
        if(newFiles.length) {
            for(var newFile of newFiles){
                // console.log('deleting: ', newFile);
                deleteStoredObject('miscellaneous', newFile.downloadUrl);
            }
        }
        if(entry.images && entry.images.length) {
            for(var newFile of entry.images){
                // console.log('deleting: ', newFile);
                deleteStoredObject('image', newFile.url);
            }
        }

        if(entry.audio && entry.audio.length) {
            for(var newFile of entry.audio){
                // console.log('deleting: ', newFile);
                deleteStoredObject('audio', newFile.url);
            }
        }
        
        if(entry.files && entry.files.length) {
            for(var newFile of entry.files){
                // console.log('deleting: ', newFile);
                deleteStoredObject('miscellaneous', newFile.url);
            }
        }

        const db = getFirestore();
        const docRef = doc(db, 'CMS', _projectName, sectionName, entry.id)
        deleteDoc(docRef)
            .then(()=>{
                // console.log('Successfully deleted entry');
            })
            .catch(err => {
                console.error("Error deleting entry: ", err);
            });
    }
    
    const deleteStoredObject = (type, downloadUrl) => {
        // Only delete if the url is to an existing file
        // console.log("deleting url 1: ", downloadUrl);
        /*switch(type){
            case 'image': {
                if(!(newImage.url || "").includes(STORAGE_ROOT)){
                    return;
                }
                break;
            }
            case 'audio': {
                if(!(newAudio.url || "").includes(STORAGE_ROOT)){
                    return;
                }
                break;
            }
            case 'miscellaneous': {
                if(!(downloadUrl || "").includes(STORAGE_ROOT)){
                    return;
                }
                break;
            }
            default: {
                console.error('Returning on default');
                return;
            }
        }*/
        if(!(downloadUrl || "").includes(STORAGE_ROOT)){
            return;
        }
    
        var storageRef = ref(getStorage(), downloadUrl)
        //getStorage() 
        deleteObject(storageRef).then(()=>{
            console.log('Deleted successfully: ', downloadUrl);
        }).catch(err => {
            console.error("Error deleting stored item");
        }) 
    }

    const toggleAdditionalDate = () => {
        setShowingAdditionalDate(!showingAdditionalDate);
    }

    // console.log("currentUid: ", currentUid, ', loginComplete: ', loginComplete);
    return(
        <div className={styles.CMS}>
            <Head>
                <meta charSet="utf-8" />
                <title>Update your website</title>
                <link rel="icon" type="image/png" href="blank.ico" sizes="16x16" />
            </Head>
            {
                !currentUid && loginComplete &&
                <div className={styles.overlay}>
                    <div className={styles.content}>
                        <h2>Login to update your website</h2>
                        <p>Please use your approved email address</p>
                        {/* <p>Update your website content</p> */}
                        <div className={styles.login} onClick={()=>{
                            LogIn()}}>
                            <span>Login</span>
                        </div>
                    </div>
                </div>
            }
            <div className={styles.inner}>
                <div className={styles.left}>
                    <div className={styles.title}>
                        <h4 className={styles.subtitle}>Website Content Management</h4>
                        <h1>{pageData.projectName}</h1>
                    </div>
                    { webpageEditable
                        ? <div className={styles.editType_wrapper + " " + (editType === 0 ? styles.left_selected : styles.right_selected)}>
                            <div className={editType === 0 ? styles.selected : ""} onClick={()=>setEditType(0)}>Page Content</div>
                            <div className={editType === 1 ? styles.selected : ""} onClick={()=>setEditType(1)}>Dynamic Content</div>
                        </div>
                        : <></>
                    }
                    { editType === 0
                        ? <div className={styles.sections_wrapper}>
                            <div className={styles.section} style={{backgroundColor:"white"}}>Select text on the right to edit it.</div>
                        </div>
                        : <div className={styles.sections_wrapper}>
                            { pageData.sections &&
                                pageData.sections.map((section, i) => (
                                    <div key={"left-section-"+i} className={styles.section + " " + (selectedSectionIndex === i ? styles.selected : "")} onClick={()=>{updateSelectedSectionIndex(i)}}>{section.name}</div>
                                ))
                            }
                        </div>
                    }
                    <div className={styles.profile}>
                        { currentUser.photoURL
                            ? <LazyLoadImage src={currentUser.photoURL} effect="blur" alt="" />
                            : <LazyLoadImage src={profile} effect="blur" alt="" />
                        }
                        <div className={styles.details_wrapper}>
                            {
                                currentUser.displayName
                                ? <div className={styles.displayName}><span>{currentUser.displayName}</span></div>
                                : <div onClick={()=>{LogIn()}}></div>
                            }
                            {
                                currentUser.email
                                ? <div className={styles.email}><span>{currentUser.email}</span></div>
                                : <div></div>
                            }
                        </div>
                        { currentUser
                            ? <X onClick={()=>{getAuth().signOut();}}/>
                            : <></>
                        }
                    </div>
                    <div className={styles.attribution}>
                        <span>Website content management - Webbi&copy; 2021</span>
                    </div>
                </div>
                <div className={styles.right}>
                    { editType === 0
                        ? <>
                            {/* <div className="top">
                                <div className="header">
                                    <h1>Edit Content</h1>
                                </div>
                                <div className="wrapper" />
                            </div> */}
                            <WebpageEditor 
                                pageData={pageData} 
                                projectName={_projectName} 
                                email={currentEmail} />
                        </>
                        : <>
                            <div className={styles.top}>
                                <div className={styles.header}>
                                    { 
                                        pageData.sections && <h1>{pageData.sections[selectedSectionIndex].name}</h1>
                                    }
                                </div>
                                <div className={styles.wrapper} onClick={()=>{setShowingNew(!showingNew)}}>
                                    {
                                        showingNew 
                                        ? <X width="48" />
                                        : <Plus width="48" />
                                    }
                                </div>
                            </div>
                            
                            <div className={styles.inner}>
                                { pageData.sections && 
                                    (Object.values(pageData[currentSection.name] || {})).map((entry, index) => (
                                        <SectionContent 
                                            key={"inner-entry-" + index} 
                                            entry={entry} 
                                            setShowingEdit={setShowingEdit}
                                            setShowingNew={setShowingNew}
                                            setNewAudio={setNewAudio}
                                            setNewImages={setNewImages}
                                            setNewFiles={setNewFiles}
                                            setNewDate={setNewDate}
                                            setAdditionalDate={setAdditionalDate}
                                            setNewTitle={setNewTitle}
                                            setNewText={setNewText}
                                            setShowingDeleteDialog={setShowingDeleteDialog}
                                            projectName={projectName}
                                            sectionName={currentSection.name}
                                            setRteInitTitle={setRteInitTitle}
                                            setRteInitContent={setRteInitContent}
                                            setShowingAdditionalDate={setShowingAdditionalDate}
                                            setNewFields={setNewFields}
                                            setOrderInList={setOrderInList}
                                        />
                                    ))
                                }
                            </div>
                        </>
                    }
                </div>
                <div className={styles.overlay + " " + (showingNew ? styles.showing : "")} onClick={()=>{hideShowingNew()}}></div>
                <div className={styles.modal + " " + (showingNew ? styles.showing : "")}>
                    <div className={styles.title}>
                        <div>
                            <X onClick={()=>{
                                hideShowingNew();
                            }} />
                            {pageData.sections ?
                                showingEdit
                                    ? <h1>Edit {currentSection.name.toString().toLowerCase()}</h1>
                                    : <h1>Create {currentSection.name.toString().toLowerCase()}</h1>
                                : <></>
                            }
                            {/* {pageData.sections[selectedSectionIndex]} */}
                        </div>
                        <div>
                            <div className={styles.save  + " " + styles.ok} onClick={()=>{saveNew()}}>
                                <span>Save</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.media_upload_wrapper}>
                            
                            
                                <>
                                    <label htmlFor='image-upload'>
                                        <div className={styles.image_upload_wrapper}>
                                            <Image />
                                           
                                        </div>
                                    </label>
                                    <input id={'image-upload'} type="file" onChange={onImageAdded} hidden={true} accept="image/*" onClick={(e)=>{e.target.value = ""}} />
                                </>
                            
                            
                            
                                <>
                                    <label htmlFor='audio-upload'>
                                        <div className={styles.audio_upload_wrapper}>
                                        
                                            <Headphones />
                                        </div>
                                    </label>
                                    <input id='audio-upload' type="file" onChange={onAudioAdded} hidden={true} accept=".mp3,.aif,.aiff,.ogg,.wav,audio/*" onClick={(e)=>{e.target.value = ""}} />
                                </>
                            
                            <label htmlFor='file-upload'>
                                <div className={styles.file_upload_wrapper}>
                                    <File />
                                </div>
                            </label>
                            <input id='file-upload' type="file" onChange={onFileAdded} hidden={true} accept="application/pdf,application/msword,text/plain,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onClick={(e)=>{e.target.value = ""}} />
                        </div>

                        <div className={styles.uploaded_previews + " " + styles.box}>
                        { 
                            newImages && newImages.length
                            ? <div>
                                { newImages.map((newImage, i) => (
                                    <div className={styles.uploaded_img_wrapper} key={"img-"+i}>
                                        <LazyLoadImage className={styles.uploaded_img} src={newImage.url} effect="blur" alt="" />
                                        <div onClick={()=>{removeUploadedImg(newImage.url)}}>
                                            <X />
                                        </div>
                                    </div>
                                    ))
                                }
                            </div>
                            : <></>
                        }

                        {
                            newAudio && newAudio.length
                            ? <div>
                                { newAudio.map((audio, i) => (
                                    <div className={styles.uploaded_audio_wrapper} key={"audio-"+i}>
                                        <audio 
                                            controls 
                                            className={styles.uploaded_audio}
                                            src={audio.url} type=".mp3,audio/*" 
                                        />
                                        <div onClick={()=>{removeUploadedAudio(audio.url)}}>
                                            <X />
                                        </div>
                                    </div>
                                ))
                                }
                            </div>
                            : <></>
                        }

                        {
                            newFiles && newFiles.length 
                            ? <div>
                                { newFiles.map((newFile, i) => (
                                    <div className={styles.uploaded_miscellaneous_wrapper} key={"miscellaneous-"+i}>
                                        <div>
                                            <a href={newFile.downloadUrl || newFile.url} download={newFile.name}>{newFile.name}</a>
                                        </div>
                                        <div onClick={()=>removeUploadedMiscellaneous(newFile.url)}>
                                            <X />
                                        </div>
                                    </div>
                                ))
                                }
                            </div>
                            : <></>
                        }
                        </div>

                        {/* https://www.npmjs.com/package/react-date-picker */}
                        <div className={styles.box}>
                            <div className={styles.date_wrapper}>
                                <h4>Date</h4>
                                <div className={styles.svg_wrapper} onClick={()=>{toggleAdditionalDate()}}>
                                    <label>Using a date range</label>
                                    <div className={styles.svg_wrapper_inner + " " + (showingAdditionalDate ? styles.showing : "")}>
                                    {
                                        showingAdditionalDate 
                                        // ? <Minus />
                                        // : <Plus />
                                        ? <Check size={22}/>//<CheckSquare />
                                        : <Square size={22}/>
                                    }
                                    </div>
                                </div>
                                
                            </div>
                            {/* <input
                                type="date"
                                // value={newDate}
                                defaultValue={new Date().toLocaleDateString('en-CA').toString()}
                                onChange={onDateAdded}
                            /> */}
                            <DatePicker
                                onChange={onDateAdded}
                                selected={newDate}
                                // selected="2020-10-29"
                                dateFormat="yyyy-MM-dd"
                                // dateFormat="yyyy"
                                // defaultValue={new Date().toLocaleDateString('en-CA').toString()}
                            />
                            {
                                showingAdditionalDate && 
                                <div id={styles.additional_datepicker}>
                                    <DatePicker
                                        onChange={onAdditionalDateAdded}
                                        selected={additionalDate}
                                        dateFormat="yyyy-MM-dd"//"yyyy"
                                        // defaultValue={new Date().toLocaleDateString('en-CA').toString()}
                                    />
                                </div>
                            }
                        </div>
                        <div className={styles.box}>
                            <FieldsDisplay 
                                currentSection={currentSection}
                                allFields={pageData.sections}
                                currentFields={newFields} 
                            />
                        </div>

                        <div className={styles.title_upload + " " + styles.box}>
                            <h4>Title</h4>
                            {/* <input value={newTitle} onChange={onTitleChange} /> */}
                            <TextEditor 
                                // value={newTitle} 
                                // value={RichTextEditor.createValueFromString(newTitle, 'html')}
                                initialValue={rteInitTitle}
                                value={RichTextEditor.createValueFromString(newTitle, 'html')}
                                onChange={onTitleChange} 
                            />
                        </div>
                        
                        <div className={styles.text_upload + " " + styles.box}>
                            <h4>Content</h4>
                            {/* <textarea value={newText} onChange={onTextChange} /> */}
                            <TextEditor 
                                // value={newText} 
                                // value={RichTextEditor.createValueFromString(newText, 'html')}
                                initialValue={rteInitContent}
                                value={RichTextEditor.createValueFromString(newText, 'html')}
                                onChange={onTextChange} 
                                files={newFiles} // Pass files through to link to
                            />
                        </div>

                        <div>
                            <label htmlFor="orderInList">Order to display this in</label>
                            <input id="orderInList" defaultValue={orderInList} />
                        </div>

                    </div>
                    
                    <Loading loading={showSaving} /> 
                </div>

                <div className={styles.overlay + " " + (showingDeleteDialog ? styles.showing : "")} onClick={()=>{setShowingDeleteDialog(false)}}></div>
                <div className={styles.deleteDialog + " " + (showingDeleteDialog ? styles.showing : "")}>
                    <h4>Are you sure you want to delete this?</h4>
                    <div className={styles.options_wrapper}>
                        <div className={styles.cancel} onClick={()=>{setShowingDeleteDialog(false);}}>
                            <span>Cancel</span>
                        </div>
                        <div className={styles.ok} onClick={()=>{
                            deleteSectionContent(showingDeleteDialog, _projectName, currentSection.name);
                            setShowingDeleteDialog(false);
                        }}>
                            <span>Ok</span>
                        </div>
                    </div>
                </div>
                
            </div>
            
            {/* <div>
                <label>Username</label>
                <input value={username} onChange={setUsername} />
                <label>Password</label>
                <input valu={password} onChange={setPassword} />
            </div> */}
        </div>
    )
}

const SectionContent = ({
    entry,
    projectName,
    sectionName,
    setShowingEdit,
    setShowingNew,
    setNewAudio,
    setNewImages,
    setNewFiles,
    setNewDate,
    setAdditionalDate,
    setOrderInList,
    setNewTitle,
    setNewText,
    setShowingDeleteDialog,
    setRteInitTitle,
    setRteInitContent,
    setShowingAdditionalDate,
    setNewFields,
}) => {
    // console.log(entry);
    return(
        <div className={styles.SectionContent}>
            <div className={styles.content}>
                <div className={styles.cms_media_wrapper}>
                    {
                        // TODO Display images as small and in a grid
                        (entry.images && entry.images.length)
                        ? <LazyLoadImage src={entry.imageURL || entry.images[0].url} effect="blur" width="260px" 
                            // height="calc(100% - 54px)" 
                            height="fit-content"
                            alt="" />
                        : <></>
                    }
                    {
                        (entry.audio && entry.audio.length)
                        ? <audio controls src={entry.audioURL || entry.audio[0].url} type=".mp3,audio/*"/>
                        : <></>
                    }
                    {
                        entry.files && entry.files.length ?
                        <div className={styles.file}>
                            <Paperclip />
                            <p>{entry.files.length} resource{entry.files.length > 1 ? "s" : ""}</p>
                            {/* Could optionally add sizes here */}
                        </div>
                        : <></>
                    }
                </div>
                <div className={styles.right_content}>
                    {/* {entry.imgUrl && <img src={entry.imgUrl} />}
                    {entry.audioURL && 
                        <audio controls>
                            <source src={entry.audioURL} type="audio/mpeg" />
                        </audio>
                    } */}
                    <div dangerouslySetInnerHTML={{__html: entry.title}} />
                    <div className={styles.date_display_container}>
                        {entry.date && <p className={styles.date}>{firebaseDate2DisplayDate(entry.date.seconds * 1000)}</p>}
                        {entry.additionalDate && <p className={styles.additionalDate}>{firebaseDate2DisplayDate(entry.additionalDate.seconds * 1000)}</p>}
                    </div>
                    <div className={styles.contents} dangerouslySetInnerHTML={{__html:entry.content}} />
                </div>
            </div>
            <div>
                <div className={styles.edit} onClick={()=>{
                    // console.log('showing entry: ', entry.date);
                    setShowingEdit(entry);
                    setShowingNew(true);
                    setNewAudio(entry.audio || []);
                    setNewImages(entry.images || []);
                    setNewFiles(entry.files || []);
                    setNewDate(new Date(entry.date.seconds * 1000));
                    if(entry.additionalDate){
                        setShowingAdditionalDate(true);   
                    }
                    var ad = entry.additionalDate 
                        ? entry.additionalDate.seconds * 1000
                        : Date.now();
                    // console.log("ad: ", ad);
                    setAdditionalDate(new Date(ad));
                    setNewTitle(entry.title || "");
                    setNewText(entry.content || "");
                    setNewFields(entry.fields || []);
                    setOrderInList(entry.orderInList);

                    setRteInitTitle(entry.title || "");
                    setRteInitContent(entry.content || "");
                }}>
                    <Edit />
                </div>
                <div className={styles.delete} onClick={()=>{
                    setShowingDeleteDialog(entry);
                }}>
                    <Trash2 />
                </div>
            </div>
        </div>
    )
}
