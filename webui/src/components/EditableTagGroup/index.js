import React, { Component } from 'react';
import T from 'prop-types';
import { Tag, Input, Tooltip, Button } from 'antd';

class EditableTagGroup extends Component {

  static propTypes = {
    value: T.arrayOf(T.string),
    onChange: T.func,
  }

  static defaultProps = {
    value: [],
    onChange: undefined,
  }

  constructor(props) {
    super(props);

    this.state = {
      tags: this.props.value,
      inputVisible: false,
      inputValue: '',
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      tags: nextProps.value,
    });
  }

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });

    const { onChange } = this.props;
    onChange(tags);
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });

    const { onChange } = this.props;
    onChange(tags);
  }

  saveInputRef = (input) => {
    this.input = input;
  }

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    return (
      <div>
        {tags.map((tag) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} closable afterClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? <Tooltip title={tag}>{tagElem}</Tooltip> : tagElem;
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && <Button size="small" type="dashed" onClick={this.showInput}>+ New Tag</Button>}
      </div>
    );
  }
}

export default EditableTagGroup;
