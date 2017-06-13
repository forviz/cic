import React, { Component } from 'react';
import T from 'prop-types';
import _ from 'lodash';
import { Input, Select } from 'antd';

const InputGroup = Input.Group;
const Search = Input.Search;
const Option = Select.Option;

class EntryFilterBar extends Component {

  static propTypes = {
    onSearch: T.func.isRequired,
    contentTypes: T.arrayOf(T.shape({
      _id: T.string,
      name: T.string,
    })),
  }

  static defaultProps = {
    contentTypes: [],
  }

  state = {
    content_type: '',
    status: '',
    search: '',
  }

  handleChange = (name, value) => {
    const newState = {
      ...this.state,
      [name]: value,
    };

    this.setState({
      [name]: value,
    });
    this.handleSubmit(newState);
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleSubmit(this.state);
    }
  }

  handleSubmit = (values) => {
    this.props.onSearch(values);
  }

  render() {
    const { contentTypes } = this.props;
    return (
      <InputGroup compact>
        <Select defaultValue="" style={{ width: '25%' }} onChange={value => this.handleChange('content_type', value)}>
          <Option value="">All Type</Option>
          {_.map(contentTypes, ct => <Option value={ct._id}>{ct.name}</Option>)}
        </Select>
        <Select defaultValue="" style={{ width: '25%' }} onChange={value => this.handleChange('status', value)}>
          <Option value="">All Status</Option>
          <Option value="draft">Draft</Option>
          <Option value="publish">Publish</Option>
        </Select>
        <Search
          placeholder="Filter entries"
          style={{ width: '50%' }}
          onKeyDown={this.handleKeyDown}
          onChange={e => this.setState({ search: e.target.value })}
        />
      </InputGroup>
    );
  }
}

export default EntryFilterBar;
