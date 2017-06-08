import React, { Component } from 'react';
import {
  Editor,
  createEditorState,
} from 'medium-draft';

import 'medium-draft/lib/index.css';

class Medium extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: createEditorState(),
    };

    this.onChange = (editorState) => {
      this.setState({ editorState });
    };
  }

  componentDidMount() {
    this.editor.focus();
  }

  /* eslint-disable no-return-assign */
  render() {
    const { editorState } = this.state;
    return (
      <Editor
        ref={c => this.editor = c}
        editorState={editorState}
        onChange={this.onChange}
      />
    );
  }
  /* eslint-enable no-return-assign */
}

export default Medium;
