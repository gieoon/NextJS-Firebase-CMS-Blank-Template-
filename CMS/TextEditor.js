import React, {PropTypes} from 'react';
import RichTextEditor, {createEmptyValue, EditorValue} from 'react-rte';
import {RichUtils, EditorState, Modifier, convertToRaw} from 'draft-js'
import {X} from 'react-feather';

// https://github.com/sstur/react-rte/blob/master/src/EditorDemo.js
// https://github.com/sstur/react-rte/blob/8c81622706a5f8856d39497bf33f92a97e9664fc/src/lib/EditorValue.js#L42

// Demonstrates how to add links
// https://codepen.io/Kiwka/pen/ZLvPeO

// console.log('PropTypes: ', PropTypes);
export default class RichEditor extends React.Component {
    // static propTypes = {
    //     onChange: PropTypes.func
    // };
    editorValue = RichTextEditor.createEmptyValue();
    state = {
        value: this.editorValue, //this.props.initialValue,
        // editorState: this.editorValue.getEditorState(),
        //this.props.value,//
        files: this.props.files,
        showDropdown: false,
    }
    
    componentDidUpdate(prevProps, prevState, snapshot){
      // if(this.props.value !== this.state.value){//prevProps.value){
        // console.log(this.state, this.props, prevProps);
      if(this.props.initialValue !== prevProps.initialValue){//prevProps.value){
        // console.log(this.props)
        // console.log(prevProps);
        // console.log('UPDATING');
        // count++;
        this.setState({
          value: RichTextEditor.createValueFromString(this.props.initialValue, 'html'),
        });
      }
    }

    componentDidMount(){
      // console.log("mounted: ", this.props.initialValue);
      // this.setState({
      //   value: this.props.initialValue || "",
      // });
    }
    
    onChange = (value) => {
        this.setState({value});
        if (this.props.onChange) {
          // Send the changes up to the parent component as an HTML string.
          // This is here to demonstrate using `.toString()` but in a real app it
          // would be better to avoid generating a string on each change.
          // console.log('value.tostring(): ', value.toString('html'));
          this.props.onChange(
            value.toString('html')
          );
        }
    };
    
    render () {
      // console.log(this.state.value);

        const toolbarConfig = {
            display: [
                'INLINE_STYLE_BUTTONS', 
                'BLOCK_TYPE_BUTTONS', 
                'BLOCK_TYPE_DROPDOWN', 
                'LINK_BUTTONS', 
                //'HISTORY_BUTTONS'
            ],
            INLINE_STYLE_BUTTONS: [
              {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
              {label: 'Italic', style: 'ITALIC'},
              {label: 'Underline', style: 'UNDERLINE'},
            ],
            BLOCK_TYPE_DROPDOWN: [
              {label: 'Normal', style: 'unstyled'},
              {label: 'Small Title', style: 'header-three'},
              {label: 'Medium Title', style: 'header-two'},
              {label: 'Large Title', style: 'header-one'},
            ],
            BLOCK_TYPE_BUTTONS: [
              {label: 'UL', style: 'unordered-list-item'},
              {label: 'OL', style: 'ordered-list-item'}
            ]
        };
        // console.log(window.getSelection().toString());
        
        // lastHighlighted = window.getSelection().toString().length 
        //   ? window.getSelection().toString() 
        //   : lastHighlighted;
        // console.log(lastHighlighted);

        return (
          <RichTextEditor
            value={this.state.value}
            // value={RichTextEditor.createValueFromString(this.state.value, 'html')}
            onChange={this.onChange}
            toolbarConfig={toolbarConfig}
            customControls={[
              (setValue, getValue, editorState) => {
                // console.log(getValue('custom-file-link').toString());
                // console.log(editorState.getCurrentContent().toString())
                // console.dir(editorState.toString('html'))
                
                // let rawContentState = window.rawContentState = convertToRaw(contentState);
                // console.log(JSON.stringify(rawContentState));
                // console.log("currentContent 2: ", contentState);
                // var currentContentBlock = contentState.getBlockForKey(anchorKey);
                // var start = selectionState.getStartOffset();
                // var startKey = selectionState.getStartKey();
                // var end = selectionState.getEndOffset();
                // const linkKey = currentContentBlock.getEntityAt(start);
                // console.log('Link key is: ', linkKey);
                // var selectedText = currentContentBlock.getText().slice(start, end);
                // console.log(
                  // selectionState, 
                  // anchorKey, 
                  // currentContent, 
                  // currentContentBlock.getData(), 
                  // "anchorKey: ", anchorKey,
                  // startKey,
                  // start, 
                  // end, 
                  // selectedText
                // );
                // console.log(window.getSelection().toString());
                // console.log(this.state.value.getEditorState().getCurrentContent())
                // console.log(this.state.value.getCurrentContent().toString())
                return this.props.files
                  ? <div className="link-file" onClick={()=>{
                      console.log('Link to file clicked: ', this.props.files);
                      // console.log(window.getSelection().toString());
                      this.setState({
                        showDropdown: !this.state.showDropdown,
                      });
                      // setValue('custom-file-link', this.state.value);
                    }} style={{display: this.props.files.length ? "inline-block" : "none"}}>
                      { this.state.showDropdown 
                        ? <X /> 
                        : "Link to a file"
                      }
                      <div className={"link-file-dropdown " + (this.state.showDropdown ? "showing" : "")}>
                        {
                          this.props.files.map((file, i)=>(
                            <div key={"link-file-"+i} onClick={()=>{
                              console.log('file selected: ', file);

                              var selectionState = editorState.getSelection();
                              var anchorKey = selectionState.getAnchorKey();
                              var contentState = editorState.getCurrentContent();
                              const contentStateWithEntity = contentState.createEntity(
                                'LINK',
                                'MUTABLE',
                                {url: `file:${file.id}`, //file.name
                                class: "file-link"
                                }
                              )
                              const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
                              const newEditorState = EditorState.set(editorState, {
                                currentContent: contentStateWithEntity,
                              });

                              // this.setState({
                              //   editorState: RichUtils.toggleLink(
                              //     newEditorState,
                              //     newEditorState.getSelection(),
                              //     entityKey,
                              //   ),
                              // })

                              const newValue = new EditorValue(
                                RichUtils.toggleLink(
                                  newEditorState,
                                  newEditorState.getSelection(),
                                  entityKey,
                                'html'),
                              )

                              this.setState({
                                value: newValue
                              })
                              this.props.onChange(
                                newValue.toString('html')
                              );

                              // console.log("currentContent 1: ", contentState.toJS());
                              
                              // console.log('start: ', start, this.state.value.toString('html').substring(0, start));
                              // const newState = Modifier.replaceText(
                              //   currentContent,
                              //   selectionState,
                              //   "Hello world",
                              // )
                              // console.log(newState)
                              // this.setState({
                              //   value: RichTextEditor.createValueFromString(
                              //     `${this.state.value.toString('html').substring(0, start)} <a href='file:${file.name}'>${selectedText}</a> ${this.state.value.toString('html').substring(end)}`, 'html'),
                              // });
                              // this.setState({
                              //   value: //EditorValue.createFromState(
                              //     newState
                              //     // RichUtils.toggleLink(
                              //     //   editorState,
                              //     //   selectionState,
                              //     //   anchorKey
                              //     // )
                              //   //)
                              // })
                            }}>
                              <span>{file.name}</span>
                            </div>
                          ))
                        }
                      </div>
                  </div>
                  : <></>
              },
            ]}
          />
        );
    }
}



/*
import {Editor, EditorState, RichUtils, getDefaultKeyBinding} from 'draft-js';
// import 'draft-js/dist/Draft.css';
import '../dist/RichEditor.css';
export default class RichEditorExample extends React.Component {
    constructor(props) {
      super(props);
      this.state = {editorState: EditorState.createEmpty()};
      this.focus = () => this.refs.editor.focus();
      this.onChange = (editorState) => this.setState({editorState});
      this.handleKeyCommand = this._handleKeyCommand.bind(this);
      this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
      this.toggleBlockType = this._toggleBlockType.bind(this);
      this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
    }
    _handleKeyCommand(command, editorState) {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        this.onChange(newState);
        return true;
      }
      return false;
    }
    _mapKeyToEditorCommand(e) {
      if (e.keyCode === 9) {
        const newEditorState = RichUtils.onTab(
          e,
          this.state.editorState,
          4,
        );
        if (newEditorState !== this.state.editorState) {
          this.onChange(newEditorState);
        }
        return;
      }
      return getDefaultKeyBinding(e);
    }
    _toggleBlockType(blockType) {
      this.onChange(
        RichUtils.toggleBlockType(
          this.state.editorState,
          blockType
        )
      );
    }
    _toggleInlineStyle(inlineStyle) {
      this.onChange(
        RichUtils.toggleInlineStyle(
          this.state.editorState,
          inlineStyle
        )
      );
    }
    render() {
      const {editorState} = this.state;
      // If the user changes block type before entering any text, we can
      // either style the placeholder or hide it. Let's just hide it now.
      let className = 'RichEditor-editor';
      var contentState = editorState.getCurrentContent();
      if (!contentState.hasText()) {
        if (contentState.getBlockMap().first().getType() !== 'unstyled') {
          className += ' RichEditor-hidePlaceholder';
        }
      }
      return (
        <div className="RichEditor-root">
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
          />
          <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
          />
          <div className={className} onClick={this.focus}>
            <Editor
              blockStyleFn={getBlockStyle}
              customStyleMap={styleMap}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand}
              keyBindingFn={this.mapKeyToEditorCommand}
              onChange={this.onChange}
              placeholder="Your content here..."
              ref="editor"
              spellCheck={true}
            />
          </div>
        </div>
      );
    }
  }
  // Custom overrides for "code" style.
  const styleMap = {
    CODE: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
  };
  function getBlockStyle(block) {
    switch (block.getType()) {
      case 'blockquote': return 'RichEditor-blockquote';
      default: return null;
    }
  }
  class StyleButton extends React.Component {
    constructor() {
      super();
      this.onToggle = (e) => {
        e.preventDefault();
        this.props.onToggle(this.props.style);
      };
    }
    render() {
      let className = 'RichEditor-styleButton';
      if (this.props.active) {
        className += ' RichEditor-activeButton';
      }
      return (
        <span className={className} onMouseDown={this.onToggle}>
          {this.props.label}
        </span>
      );
    }
  }
  const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'H3', style: 'header-three'},
    {label: 'H4', style: 'header-four'},
    {label: 'H5', style: 'header-five'},
    {label: 'H6', style: 'header-six'},
    {label: 'Blockquote', style: 'blockquote'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'},
    {label: 'Code Block', style: 'code-block'},
  ];
  const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();
    return (
      <div className="RichEditor-controls">
        {BLOCK_TYPES.map((type) =>
          <StyleButton
            key={type.label}
            active={type.style === blockType}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
          />
        )}
      </div>
    );
  };
  var INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'},
    {label: 'Monospace', style: 'CODE'},
  ];
  const InlineStyleControls = (props) => {
    const currentStyle = props.editorState.getCurrentInlineStyle();
    
    return (
      <div className="RichEditor-controls">
        {INLINE_STYLES.map((type) =>
          <StyleButton
            key={type.label}
            active={currentStyle.has(type.style)}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
          />
        )}
      </div>
    );
};
*/