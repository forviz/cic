import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class WYSIWYG extends Component {

  onEditorStateChange = (state) => {
    const { onChange } = this.props;
    onChange(state);
  }

  render () {
    const { value } = this.props;
    return (
      <div>
      <Editor
        editorState={value}
        toolbarClassName="home-toolbar"
        wrapperClassName="home-wrapper"
        editorClassName="home-editor"
        onEditorStateChange={this.onEditorStateChange}
        // uploadCallback={uploadImageCallBack}
      />
      </div>
    )
  }
}

export default WYSIWYG;
