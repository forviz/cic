import React, { Component } from 'react';
import T from 'prop-types';
import _ from 'lodash';
import { Input, Select, Row, Col, Button } from 'antd';

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

  handleSubmit = () => {
    const values = {
      content_type: this.state.content_type,
      status: this.state.status,
      search: this.state.search,
    };
    this.props.onSearch(values);
  }

  render() {
    const { contentTypes } = this.props;
    return (
      <Row>
        <Col span={24}>
          <div style={{ marginBottom: 20, background: '#f7f7f7', padding: 20 }}>
            <Row gutter={8}>
              <Col span={6}>
                <div>Content Type </div>
                <Select defaultValue="all" style={{ width: 120 }} onChange={value => this.setState({ content_type: value })}>
                  <Option value="all">All</Option>
                  {_.map(contentTypes, ct => <Option value={ct._id}>{ct.name}</Option>)}
                </Select>
              </Col>
              <Col span={6}>
                <div>Status </div>
                <Select defaultValue="" style={{ width: 120 }} onChange={value => this.setState({ status: value })}>
                  <Option value="">All</Option>
                  <Option value="draft">Draft</Option>
                  <Option value="publish">Publish</Option>
                </Select>
              </Col>
              <Col span={6}>
                <div>Search </div>
                <Search
                  placeholder="Filter entries"
                  style={{ width: '100%' }}
                  onChange={e => this.setState({ search: e.target.value })}
                />
              </Col>
              <Col span={6}>
                <div>&nbsp;</div>
                <Button type="primary" icon="search" onClick={this.handleSubmit}>Search</Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    );
  }
}

export default EntryFilterBar;
