// This has been moved to npm package firestore-cms-iframe.

import React, {useEffect, useState, ReactDOM} from 'react';
// This is shared code for all CMS listeners.
// Listens to events from login.<domain-name>.craftie.xyz, 
// Edits the page after events are received.
import Quill from 'quill';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import getCssSelector from 'css-selector-generator';
// import htmlToText from 'html-to-text';

Quill.prototype.getHTML = (parentElement) => {
    // const fragment = document.createDocumentFragment();
    // const parser = new DOMParser();
    // const newNode = parser.parseFromString(
    //     parentElement.querySelector('.ql-editor').innerHTML, 
    //     'text/html'
    // );
    // const els = newNode.documentElement.querySelectorAll('div');
    // for (let index = 0; index < els.length; index++) {
    //     fragment.appendChild(els[index]);  
    // }
    // // parent.appendChild(fragment);
    // console.log(fragment);
    return parentElement.querySelector('.ql-editor').innerHTML;
    // return parentElement.querySelector('.ql-editor').innerText;
};

Quill.prototype.setHTML = (parentElement, html) => {
    parentElement.querySelector('.ql-editor').innerHTML = html;
}

const quills = {};
// const original_innerHTMLs = {};

var isStarted = false;

export default function CMS({
    allowedOrigins,
    templates,
}){

    const [editing, setEditing] = useState(/*TODO make this false */true);
    // const [showEditor, setShowingEditor] = useState();
    const [currentData, setCurrentData] = useState();
    const [currentImageId, setCurrentImageId] = useState();
    
    useEffect(()=>{
        // Listen to CMS websitecontent editing events.
        window.addEventListener("message", receivedMessage, false);

        // TODO remove this, this is only to be prompted by the parent from Craftie.xyz.
        // highlightEditable({origin: allowedOrigins, data: "startEdit"});
        window.onclick = (e) => {
            // console.log("something was clicked: ", e.target);
            var isEditingContainer = Boolean(e.target.closest(".cp-editable.editing"));
            if(isEditingContainer){
                // console.log('BLOCKING');
                e.preventDefault();
                e.stopPropagation();
            }
            // if(e.target.classList.contains('ql-editor')){
            //     e.preventDefault();
            //     e.stopPropagation();
            // }
        }
        if (window.location.pathname === '/login') {
            var clear = setInterval(() => {
                if (!isStarted) {
                    window.parent.postMessage({
                        actionType: 'canWeStartNow?',
                    }, '*');
                }
                else {
                    console.log("started, so clearing now.")
                    clearInterval(clear);
                }

            }, 1000);
        }
    }, []);

    // Handles received messages from parent.
    const receivedMessage = (evt) => {
        // console.log('receivedMessage: ', receivedMessage, evt.data)
        // 'highlight'
        // if(!allowedOrigins.some(a => evt.origin.includes(a))) return;
        // !evt.origin.includes(allowedOrigins)) return;
        if(evt.data.actionType === 'startEdit'){
            isStarted = true;
            highlightEditable();
            setCurrentData(evt.data.websiteContent);
            setInterval(() => {
                addEditButton();
            }, 1000);
        }
        else if(evt.data.actionType === 'updateElement'){
            // document.getElementById(currentFileId).classList.toggle('editing');
            document.getElementById(evt.data.identifier).src = evt.data.file.url;
        }
        else if(evt.data.actionType === 'updateArray'){
            setCurrentData(evt.data.newWebsiteContent);
            window.location.reload();
        }
        
        // else if(evt.data.actionType === 'cancelSaveFile'){
        //     document.getElementById(currentFileId).classList.toggle('editing');
        // }
    }

    useEffect(() => {
        var head = document.head;
        var link = document.createElement("link");
    
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = "https://cdn.quilljs.com/1.3.6/quill.snow.css";
    
        head.appendChild(link);
    
        return () => { head.removeChild(link); }
    }, []);

    const addEditButton = () => {
        // Text
        const elements = Array.from(
            document.querySelectorAll('.cp-editable')
        );

        for(var el of elements){
            // Wrap in a div
            // el.innerHTML = '<div>' + el.innerHTML + '</div>';

            if(!el.querySelector('.cp-editable-btn')){
                const dw = document.createElement('div');
                dw.classList.add("cp-editable-btn-wrapper");
                const d = document.createElement('div');
                const editorContainer = document.createElement('div');
                d.textContent = "Edit";
                // const img = document.createElement('img');
                // img.src = "";
                d.classList.add('cp-editable-btn');
                editorContainer.classList.add('editor-wrapper');
                
                const d2 = document.createElement('div');
                d2.textContent = "Save";
                d2.classList.add('cp-editable-save-btn');
                

                const d3 = document.createElement('div');
                d3.textContent = "Cancel";
                d3.classList.add('cp-editable-cancel-btn');
                
                d2.onclick = (e) => {
                    saveClicked(e);
                }

                d3.onclick = (e) => {
                    cancelClicked(e);
                }
                
                d.onclick = (e) => {
                    createEditInput(e);
                }

                const editablesWrapper = document.createElement('div');
                editablesWrapper.classList.add('editables-wrapper');
                // Block clicks to the parent element.
                editablesWrapper.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }
                // el.appendChild(editorContainer);
                dw.appendChild(d);
                dw.appendChild(d2);
                dw.appendChild(d3);
                // el.appendChild(dw);
                editablesWrapper.appendChild(editorContainer);
                editablesWrapper.appendChild(dw);
                el.appendChild(editablesWrapper);
            }

        }

        // Images
        const imgElements = Array.from(
            document.querySelectorAll('.cp-editable-img')
        );
        for(var el of imgElements){
            if(!el.parentElement.querySelector('.cp-editable-img-btn')){
                el.parentElement.style.position = "relative";
                const dw = document.createElement('div');
                dw.classList.add("cp-editable-img-wrapper");
                const d = document.createElement('div');
                d.textContent = "Change Image";

                d.classList.add('cp-editable-img-btn');
                
                // const d2 = document.createElement('div');
                // d2.textContent = "Save";
                // d2.classList.add('cp-editable-img-save-btn');
                
                // const d3 = document.createElement('div');
                // d3.textContent = "Cancel";
                // d3.classList.add('cp-editable-img-cancel-btn');

                // d2.onclick = (e) => {
                //     saveImageClicked(e);
                // }
                // d3.onclick = (e) => {
                //     cancelImageClicked(e);
                // }
                dw.onclick = (e) => { // Originally d.onclick() ..., now moved to parent.
                    e.preventDefault();
                    e.stopPropagation();
                    createImageUpload(e);
                }
                dw.appendChild(d);
                // dw.appendChild(d2);
                // dw.appendChild(d3);
                el.parentElement.insertBefore(dw, el.nextSibling);
            }
        }

        // Lists
        const arrayElements = Array.from(
            document.querySelectorAll('.cp-editable-array')
        );
        for(var el of arrayElements){
            if(!el.querySelector('.cp-editable-array-minus-wrapper')){
                
                // Put remove button on direct child div.
                var childrenElements = Array.from(
                    el.querySelectorAll(':scope > *:not(.cp-editable-array-plus-wrapper)')
                );

                for(var i=0;i<childrenElements.length;i++){
                    const dm = document.createElement('div');
                    dm.classList.add('cp-editable-array-minus-wrapper');
                    const minus = document.createElement('div');
                    minus.textContent = "X";// .innerHTML = "&#9587;";
                    minus.classList.add('cp-editable-array-minus');
                    minus.id = i;
                    dm.style.position = "relative";
                    dm.appendChild(minus);
                    childrenElements[i].appendChild(dm);

                    minus.onclick = (e) => {
                        var parentElement = e.target.closest('.cp-editable-array');//e.target.parentElement.parentElement;
                        window.parent.postMessage({
                            actionType: 'removeFromArray',
                            sections: getSections(parentElement.id),
                            identifier: parentElement.id,
                            index: e.target.id,
                            // obj: constructArrayObj(e.target.parentElement)
                        }, '*');
                    }
                }
                el.style.position = "relative";
            }
            if(!el.querySelector('.cp-editable-array-plus')){
                // Search only for direct children with :scope pseudo-class.
                const dw = document.createElement('div');
                dw.classList.add("cp-editable-array-plus-wrapper");
                const plus = document.createElement('div');
                plus.textContent = "+";
                plus.classList.add('cp-editable-array-plus');

                dw.appendChild(plus);   
                el.appendChild(dw);

                plus.onclick = (e) => {
                    // console.log("parentElement: ", e.target.closest('.cp-editable-array').querySelector('> *:not(.cp-editable-array-plus-wrapper)'));
                    // Find first child that is not the plus div.
                    var parentElement = e.target.parentElement;//e.target.closest('.cp-editable-array').querySelector('> *:not(.cp-editable-array-plus-wrapper)');//e.target.parentElement.parentElement;
                    var obj = constructArrayObj(parentElement);
                    window.parent.postMessage({
                        actionType: 'addToArray',
                        sections: getSections(parentElement.closest('.cp-editable-array').id),
                        identifier: parentElement.closest('.cp-editable-array').id,
                        obj: obj,
                    }, '*');
                }
            }
        }
    }

    // Provided with an element, construct an element by detecting all children types and creating them.
    // These are found by looking for id's of the form 'asd-0-etc'
    const constructArrayObj = (parentElement) => {
        const singleInstance = [];
        // console.log(parentElement)
        // Find all elements with an 'id' attribute
        // Assume that direct child is the right type.
        // console.log("children: ", parentElement.closest('.cp-editable-array').querySelector(':scope > *'))
        // var childElement = parentElement.closest('.cp-editable-array')
            // .querySelector(':scope > *:not(.cp-editable-array-plus-wrapper)')
            // .querySelector(':scope > .cp-editable')
        // if(childElement){
        //         //.querySelector(':scope > *:not(.cp-editable-array-plus-wrapper)')/*parentElement.firstChild*/);
        //     for(var el of Array.from(childElement
        //             // .closest('.cp-editable-array')
        //             // .querySelector(':scope > *')
        //             // .querySelector(':scope > *:not(.cp-editable-array-plus-wrapper)')
        //             .querySelectorAll("[id]"))){
        //                 console.log('Found element: ', el);
        //         if(!el.classList.contains("cp-editable-array-minus")){
        //             var m = el.id.match(/[a-zA-Z0-9]+$/);
        //             console.log(m, m[0]);
        //             singleInstance.push({
        //                 type: el.tagName.toLowerCase(),
        //                 value: m[0],
        //             });
        //         }
        //     }
        // } else {
            // None exists, use template information
            console.log('USING TEMPLATE] ', parentElement.closest('.cp-editable-array').id);
            var m = parentElement.closest('.cp-editable-array').id.match(/[a-zA-Z0-9_]+$/);
            return templates[m[0]];
        // }
        // console.log(singleInstance);
        return singleInstance;
        // for(var t of [".cp-editable",".cp-editable-img",".cp-editable-array"]){
        //     for(var element of Array.from(parentElement.querySelectorAll(t))){

        //     }
        // }
    }

    const cancelClicked = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Show all other "edit" buttons because prone to bugs when editing two at once.
        Array.from(document.querySelectorAll('.cp-editable-btn')).forEach(el => {
            el.style.display = "block";
        });

        var parentElement = e.target.closest('.cp-editable');
        parentElement.classList.toggle('editing');
        // quills[getCssSelector(parentElement)].setText("");
        // Manually hide
        if(parentElement.querySelector('.ql-toolbar'))
            parentElement.querySelector('.ql-toolbar').style.display = "none";
        if(parentElement.querySelector('.ql-container'))
            parentElement.querySelector('.ql-container').style.display = "none";
        // Array.from(parentElement.querySelectorAll('.ql-toolbar'))
        //     .forEach(el => el.style.display = "none")
        // Array.from(parentElement.querySelectorAll('.ql-container'))
        //     .forEach(el => el.style.display = "none")
        
        // quills[getCssSelector(parentElement)].disable();//enable(false);
        // delete quills[getCssSelector(parentElement)];
        // parentElement.textContent = quills[getCssSelector(parentElement)].getText();
        // if (quills[getCssSelector(parentElement)]) {
            // parentElement.innerHTML = quills[getCssSelector(parentElement)].getHTML();// + parentElement.innerHTML;
            // parentElement.innerHTML = quills[parentElement.id].getHTML();
        // }
        // parentElement.innerHTML = original_innerHTMLs[parentElement.id];
        
        // // Redefine click events for buttons.
        // Recreates everything.
        addEditButton();
    }

    // Save this field to the DB
    const saveClicked = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Show all other "edit" buttons because prone to bugs when editing two at once.
        Array.from(document.querySelectorAll('.cp-editable-btn')).forEach(el => {
            el.style.display = "block";
        });

        var parentElement = e.target.closest('.cp-editable');
        var singleQuillId = parentElement.dataset.singleQuillId;
        parentElement.classList.toggle('editing');

        // Manually hide
        parentElement.querySelector('.ql-toolbar').style.display = "none";
        parentElement.querySelector('.ql-container').style.display = "none";
        // Array.from(parentElement.querySelectorAll('.ql-toolbar'))
        //     .forEach(el => el.style.display = "none")
        // Array.from(parentElement.querySelectorAll('.ql-container'))
        //     .forEach(el => el.style.display = "none")
        
        // Update local DOM
        // Update local dom as pure text?
        // htmlToText
        // var quill = quills[getCssSelector(parentElement)];
        // var currentText = quills[getCssSelector(parentElement)].getHTML();//document.querySelector('.ql-editor').textContent;//Not working => quill.getText();
        var newText;
        if(singleQuillId){
            newText = quills[singleQuillId].getHTML(parentElement);//document.querySelector('.ql-editor').textContent;//Not working => quill.getText();
        } else {
            newText = quills[parentElement.id].getHTML(parentElement);//document.querySelector('.ql-editor').textContent;//Not working => quill.getText();
        }

        // parentElement.textContent = currentText;
        // parentElement.innerHTML = currentText;
        // parentElement.innerHTML = original_innerHTMLs[parentElement.id];

        const dbObj = currentData;
        var sections = parentElement.id.split(/-|~/g);
        // sections.unshift("obj");
        var val = extractElementContent(parentElement);

        window.parent.postMessage({
            actionType: 'finishedEdit',
            sections: sections,
            val: newText,//val,
        }, '*');

        addEditButton();
    }

    // const saveImageClicked = () => {
    //     // var parentElement = e.target.parentElement.previousElementSibling;
    //     // parentElement.classList.toggle('editing');
    //     document.getElementById(currentImageId).classList.toggle('editing');
    //     // Update local DOM
    //     var sections = currentImageId.split(/-|~/g);

    //     console.log('SENDING Save Image: ', sections, currentFile);
    //     window.parent.postMessage({
    //         actionType: 'editFile',
    //         sections: sections,
    //         file: currentFile,
    //         identifier: currentImageId,
    //     }, '*');

    //     addEditButton();
    // }

    const getSections = (s) => {
        var a = s.split(/-|~/g);
        return a;
    }

    const createImageUpload = (e) => {
        var el = e.target;
        
        var parentElement = el.closest('.cp-editable-img-wrapper').previousElementSibling;//closest('.cp-editable-img');
        
//         var parentElement = el.parentElement.previousElementSibling;//closest('.cp-editable-img');
        console.log("variables: ", el, parentElement, parentElement.id);
        parentElement.classList.toggle('editing');
        // setCurrentFile(imageId);
        setCurrentImageId(parentElement.id);
        // setShowingImageUploader(true);
        window.parent.postMessage({
            actionType: 'editFile',
            sections: getSections(parentElement.id),
            identifier: parentElement.id,
        }, '*');
    }

    const extractElementContent = (el) => {
        // var matchIndex = el.innerHTML.indexOf('<div class="editor-wrapper"');
        // var firstText = el.innerHTML;//.substring(0, matchIndex);
        return el.innerHTML;//firstText;//el.textContent.replace(/EditSaveCancel/,'');
    }


    const toolbarOptions = [
        [{ 'header': [2, false] }],
        // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        ['bold', 'italic'/*, 'underline', 'strike'*/],        // toggled buttons
        [/*'blockquote', 'code-block'*/'link'],
      
        // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [/*{ 'list': 'ordered'}, */{ 'list': 'bullet' }],
        // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        // [{ 'direction': 'rtl' }],                         // text direction
      
        // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        // [{ 'font': [] }],
        // [{ 'align': [] }],
      
        // ['clean']                                         // remove formatting button
    ];

    const createEditInput = (e) => {
        var el = e.target;
        // Kills onclick() events, so has to be placed first.
        e.preventDefault();
        e.stopPropagation();
        var parentElement = el.closest('.cp-editable');
        parentElement.classList.toggle('editing');

        // Hide all other "edit" buttons because prone to bugs when editing two at once.
        Array.from(document.querySelectorAll('.cp-editable-btn')).forEach(el => {
            el.style.display = "none";
        });
        
        // // var m = parentElement.innerHTML.match(/^[^<]*/);
        // var m = parentElement.innerHTML.match(/.+?(?=<div class="editor")/s);
        // var currentText = m[0].trim();
        // var regexp = new RegExp(m[0]);
        // var matchIndex = parentElement.innerHTML.indexOf('<div class="editor-wrapper"');
        var matchIndex = parentElement.innerHTML.indexOf('<div class="editables-wrapper"');
        // var innerText;
        
        var original_HTML = parentElement.innerHTML.substring(0, matchIndex);
        var singleQuillId = undefined;

        if(parentElement.dataset.content){
            original_HTML = parentElement.dataset.content;
        }
        console.log("original_HTML: ", original_HTML);
        // Only uses one quill that is shared
        if(parentElement.dataset.singleQuillId){
            singleQuillId = parentElement.dataset.singleQuillId;
        }

        // original_innerHTMLs[parentElement.id] = original_HTML;
        // console.log('innerText: ', original_HTML);
        // console.log("firstText: ", firstText);
        // var secondText = parentElement.innerHTML.substring(matchIndex);
        // console.log('firstText: ', firstText);

        // var inp = document.createElement("input");
        if(!parentElement.querySelector('.ql-toolbar')){
            // if(innerText){
            //     parentElement.innerHTML = parentElement.innerHTML.replace(innerText, '');    
            // } else {
                // parentElement.innerHTML = parentElement.innerHTML.replace(original_HTML, '');
            // }
            // original_innerHTMLs[parentElement.id] = original_HTML;
            var quill = new Quill(parentElement.querySelector('.editor-wrapper'), { //getCssSelector(parentElement)
                modules: { toolbar: toolbarOptions },
                theme: 'snow',
                formats: ['bold','header','italic','blockquote','indent','link','strike','script','underline','list','direction','align','image','video'],
            });
            // var currentText = parentElement.innerHTML;//.replace(/EditSaveCancel$/,'');
             // Match until the first <, which denotes HTML postfixes.
            // currentText = m[0].trim();
            
            // quill.setText(currentText);
            // quill.setHTML(currentText);
            // parentElement.innerHTML = parentElement.innerHTML.replace(regexp, '');
            quill.setHTML(parentElement, original_HTML);

            // parentElement.innerHTML = secondText;

            if(singleQuillId){
                quills[singleQuillId] = quill;
            } else {
                quills[parentElement.id] = quill;
            }
        } else {
            
            // var currentText = parentElement.textContent;
            // currentText = currentText.replace(/EditSaveCancel$/,'');
            // currentText = m[0].trim();
            // var replaceText = new RegExp(currentText + "EditSaveCancel");
            // parentElement.innerHTML = parentElement.innerHTML.replace(regexp, '');
            // parentElement.innerHTML = parentElement.innerHTML.replace(original_HTML, '');
            // parentElement.innerHTML = secondText;
            // quills[getCssSelector(parentElement)].setHTML(firstText);

            // Editor doesn't exist for special types e.g. react-select, where multiple fields use the same parent.
            // Parent has Quill but children don't.

            // if (!quills[parentElement.id]) {
            //     var quill = new Quill(parentElement.querySelector('.editor-wrapper'), { //getCssSelector(parentElement)
            //         modules: { toolbar: toolbarOptions },
            //         theme: 'snow',
            //         formats: ['bold','header','italic','blockquote','indent','link','strike','script','underline','list','direction','align','image','video'],
            //     });
            //     quill.setHTML(original_HTML);
            //     quills[parentElement.id] = quill;
            // }
            // Editor already exists, just show it.
            parentElement.querySelector('.ql-toolbar').style.display = "block";
            parentElement.querySelector('.ql-container').style.display = "block";
            if(singleQuillId){
                quills[singleQuillId].setHTML(parentElement, original_HTML);
            } else {
                console.log(parentElement.id);
                quills[parentElement.id].setHTML(parentElement, original_HTML);
            }
            // console.log("quill: ", quills[parentElement.id]);
            // quills[getCssSelector(parentElement)].setText(currentText);
        }

        // Redefine click events for buttons.
        parentElement.querySelector('.cp-editable-cancel-btn').onclick = (e) => {
            cancelClicked(e);
        }
        parentElement.querySelector('.cp-editable-save-btn').onclick = (e) => {
            saveClicked(e);
        }
        // const toolbar = document.createElement('div');
        // toolbar.innerHTML = `<div id="toolbar">
        //     <button class="ql-bold">Bold</button>
        //     <button class="ql-italic">Italic</button>
        // </div>`;

        // parentElement.appendChild(toolbar);
        // parentElement.appendChild(editor);
    }



    const highlightEditable = () => {
        if(!editing)
            setEditing(true);

        addEditButton();

        // Attach CSS to head
        document.head.insertAdjacentHTML('beforeend', `
            <style>
                .cp-editable {
                    border: 2px solid black;
                    position: relative;
                    z-index: 2; /* cp-editable-img-wrapper is z-index: 1, so this needs to be above it to edit text that's on top of an image */
                }
                .cp-editable.editing {
                    pointer-events: all!important;
                    visibility: hidden;
                }
                .cp-editable.editing > div {
                    pointer-events: all!important;
                    visibility: visible;
                }
                .cp-editable::after {
                    content: "";
                    background-color: rgba(0,0,0,0.1);
                    position: absolute;
                    bottom: 0;
                    top: 0;
                    left: 0;
                    right: 0;
                    pointer-events: none;
                }
                .cp-editable.editing::after {
                    opacity: 0;
                }
                .cp-editable:hover .cp-editable-btn {
                    opacity: 1;
                }
                .cp-editable-btn-wrapper {
                    opacity: 1;
                    visibility: visible!important; /* So that this is visible even if parent is not, on the rare case where hidden labels are used */
                    /* position: absolute; */
                    position: relative;
                    /* box-shadow: 0px 0px 2px rgba(255,255,255,0.5); */
                    z-index: 1;
                    /* right: 0; */
                    right: 0;
                    pointer-events: all;
                    /* top: 5px; */
                    /* top: -15px;
                    bottom: 0px;
                    */
                   right: 0;
                   left: 0;
                   bottom: 0;
                   top: 0;
                   margin: auto;
                   width: fit-content;
                   
                    display: flex;
                    justify-content: space-evenly;
                    align-items: center;
                    -webkit-text-fill-color: initial;
                    transition: all 100ms ease-in-out;
                }
                .cp-editable-btn {
                    opacity: 0;
                }
                .cp-editable-btn,
                .cp-editable-save-btn,
                .cp-editable-cancel-btn {
                    background-color: black;
                    color: white;
                    padding: 2px 6px;
                    /* width: 50px; */
                    font-size: 15px!important;
                    font-weight: 600!important;
                    border-radius: 4px;
                    /* border: 1px solid rgba(150,150,150,0.5); */
                    cursor: pointer;
                    line-height: normal;
                    margin-left: 5px;
                    text-align: center;
                }
                /*.cp-editable-btn:hover,
                .cp-editable-save-btn:hover,
                .cp-editable-cancel-btn:hover,
                .cp-editable-img-cancel-btn:hover,
                .cp-editable-img-save-btn:hover,
                .cp-editable-img-btn:hover {
                    background-color: rgb(50,50,50);
                }*/
                .cp-editable.editing .cp-editable-btn,
                .cp-editable-img.editing .cp-editable-img-btn {
                    display: none;
                }
                .cp-editable .cp-editable-save-btn,
                .cp-editable .cp-editable-cancel-btn,
                .cp-editable-img .cp-editable-img-cancel-btn,
                .cp-editable-img .cp-editable-img-save-btn {
                    display: none;
                }
                .cp-editable.editing .cp-editable-save-btn,
                .cp-editable.editing .cp-editable-cancel-btn,
                .cp-editable-img-btn.editing .cp-editable-img-cancel-btn,
                .cp-editable-img-btn.editing .cp-editable-img-save-btn {
                    display: block;
                }

                .ql-editor {
                    white-space: normal;
                }

                .ql-toolbar, 
                .editor-wrapper,
                .ql-editor,
                .ql-editor * {
                    background-color: white!important;
                    color: black!important;
                    line-height: normal!important;
                    text-align: initial!important;
                }

                /* White space is weird in editor, so set to default */
                .ql-editor p, 
                .ql-editor h2 {
                    margin: 1em 0!important;
                }

                .editables-wrapper {
                    /* position: absolute;
                    top: 15px;
                    right: 0;
                    position: relative;
                    bottom: 0;*/
                    z-index: 999;
                    /*position: absolute;
                    inset: 0;
                    text-align: left;
                    */
                    margin: auto;
                    width: fit-content;
                    -webkit-text-fill-color: initial;
                    /* transform: translateY(-50%); */
                }
                
                .editables-wrapper:hover {
                    background-color: black;
                    border: 1px solid gray;
                    cursor: pointer;
                }

                /* Defaults */
                .editables-wrapper h1 {
                    display: block!important;
                    font-size: 2em!important;
                    margin-top: 0.67em!important;
                    margin-bottom: 0.67em!important;
                    margin-left: 0!important;
                    margin-right: 0!important;
                    font-weight: bold!important;
                }
                .editables-wrapper h2 {
                    display: block!important;
                    font-size: 1.5em!important;
                    margin-top: 0.83em!important;
                    margin-bottom: 0.83em!important;
                    margin-left: 0!important;
                    margin-right: 0!important;
                    font-weight: bold!important;
                }
                .editables-wrapper h3 {
                    display: block!important;
                    font-size: 1.17em!important;
                    margin-top: 1em!important;
                    margin-bottom: 1em!important;
                    margin-left: 0!important;
                    margin-right: 0!important;
                    font-weight: bold!important;
                }
                .editables-wrapper h4 {
                    display: block!important;
                    margin-top: 1.33em!important;
                    margin-bottom: 1.33em!important;
                    margin-left: 0!important;
                    margin-right: 0!important;
                    font-weight: bold!important;
                }
                .editables-wrapper h5 {
                    display: block!important;
                    font-size: .83em!important;
                    margin-top: 1.67em!important;
                    margin-bottom: 1.67em!important;
                    margin-left: 0!important;
                    margin-right: 0!important;
                    font-weight: bold!important;
                }
                .editables-wrapper h6 {
                    display: block!important;
                    font-size: .67em!important;
                    margin-top: 2.33em!important;
                    margin-bottom: 2.33em!important;
                    margin-left: 0!important;
                    margin-right: 0!important;
                    font-weight: bold!important;
                }
                .editables-wrapper li,
                .editables-wrapper p {
                    display: block!important;
                    margin-top: 1em!important;
                    margin-bottom: 1em!important;
                    margin-left: 0!important;
                    margin-right: 0!important;
                    font-size:initial!important;
                    font-weight: 400!important;
                }
                .editables-wrapper a {}

                .cp-editable-img-btn {
                    position: relative;
                    border: 2px solid black;
                    background-color: black!important;
                    color: white!important;
                    white-space: nowrap;
                    padding: 2px 4px;
                    width: fit-content;
                    font-size: 12px!important;
                    border-radius: 4px;
                    border: 1px solid rgba(150,150,150,0.5);
                    cursor: pointer;
                    line-height: normal;
                    font-weight: 200!important;
                    margin-left: 5px;
                }
                .cp-editable-img-wrapper {
                    position: absolute;
                    z-index: 1;
                    right: 0;
                    bottom: 5px;
                    inset: 0;
                    display: flex;
                    justify-content: space-evenly;
                    align-items: center;
                    transition: all 100ms ease-in-out;
                }
                
                .cp-editable-img-wrapper:hover {
                    background-color: black;
                    cursor: pointer;
                    border: 1px solid gray;
                }

                .cp-editable-array-minus-wrapper {
                    position: relative;
                }
                .cp-editable-array-minus {
                    position: absolute;
                    bottom: 5px;
                    left: 5px;
                    /*top: 50%;*/
                    /*transform: translateY(-50%);*/
                    border: 1px solid rgba(150,150,150,0.5);
                    border-radius: 4px;
                    font-size: 20px;
                    background-color: black;
                    font-weight: 800;
                    line-height: 20px;
                    padding: 5px 10px;
                    color: white;
                    cursor: pointer;
                }
                .cp-editable-array-plus-wrapper {
                    position: absolute;
                    left: 35px;
                    bottom: 0px;
                    z-index: 1;
                }
                .cp-editable-array-plus {
                    position: absolute;
                    bottom: -35px;
                    right: 0px;
                    background-color: black;
                    border: 1px solid rgba(150,150,150,0.5);
                    border-radius: 4px;
                    font-size: 25px;
                    color: white;
                    font-weight: 800;
                    line-height: 20px;
                    padding: 5px 10px;
                    cursor: pointer;

                }
                .cp-editable-array-plus:hover ,
                .cp-editable-array-minus:hover {
                    opacity: .75;
                }

                /* Set defaults */
                svg {
                    transform: initial!important;
                    color: initial!important;
                    cursor: initial!important;
                    margin-right: initial!important;
                    margin-top: initial!important;
                    height: initial!important;
                    display: initial!important;
                    padding: initial!important;
                    padding-right: initial!important;
                }
            </style>
        `)
    }

    return <></>;
}

