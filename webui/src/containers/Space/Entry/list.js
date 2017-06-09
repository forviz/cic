import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';
import _ from 'lodash';

import { Button, Table, Icon, Col, Row, Menu, Dropdown, message, Popconfirm, Tag, Select, Switch, Input } from 'antd';

const Option = Select.Option;
const Search = Input.Search;

import { getActiveSpace, getEntryVisibleList } from '../../../selectors';

const API_PATH = process.env.REACT_APP_API_PATH;

const getContentType = (contentTypes, contentTypeId) => {
  return _.find(contentTypes, ct => ct._id === contentTypeId);
};

class EntryList extends Component {

  static propTypes = {
    space: PropTypes.object,
  }

  state = {
    filter: {},
  }

  componentDidMount = () => {
    if (!this.props.entry) {
      const { space } = this.props;
      const { getEntryInSpace, filterEntry } = this.props.actions;
      getEntryInSpace(space._id);
      filterEntry(space._id);
    }
  }

  handleClickAddEntry = (a) => {
    const contentTypeId = a.item.props.contentTypeId;
    const { space } = this.props;
    const { createEmptyEntry } = this.props.actions;

    createEmptyEntry(space._id, contentTypeId);
  }

  confirmDeleteEntry = (entryId) => {
    const { deleteEntry } = this.props.actions;
    const { space } = this.props;
    deleteEntry(space._id, entryId)
    .then(response => {
      message.success('Deleted Entry');
    });
  }

  cancel = (e) => {
    console.log(e);
  }

  handleFilterContentTypes = (value) => {
    const filter = this.state.filter;
    filter.content_type = value;
    this.setState({filter: filter});
  }

  handleFilterStatus = (value) => {
    const filter = this.state.filter;
    filter.status = value;
    this.setState({filter: filter});
  }

  handleFilterInput = (e) => {
    const input = e.target.value;
    const filter = this.state.filter;
    filter.input = input;
    this.setState({filter: filter});
  }

  handleFilter = (e) => {
    if ( this.state.filter.content_type === 'all' ) {
      delete this.state.filter.content_type;
    }
    if ( this.state.filter.status === 'all' ) {
      delete this.state.filter.status;
    }
    if ( this.state.filter.input == '' ) {
      delete this.state.filter.input;
    }
    const { space } = this.props;
    const { filterEntry } = this.props.actions;
    filterEntry(space._id, this.state.filter);
  }

  render() {
    const { space, entries } = this.props;

    if (!space) return (<div />);

    const { contentTypes } = space;

    const columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => <Link to={`/spaces/${space._id}/entries/${record._id}`}>{text || 'No title'}</Link>,
      },
      {
        title: 'Content Type',
        dataIndex: 'contentType',
        key: 'contentType',
      },
      {
        title: 'Updated',
        dataIndex: 'updated',
        key: 'updated',
        render: (text) => moment(text).fromNow(),
      },
      {
        title: 'Author',
        dataIndex: 'author',
        key: 'author',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          switch (text) {
            case 'publish': return (<Tag color="green">Publish</Tag>);
            case 'draft': return (<Tag color="yellow">Draft</Tag>);
            case 'archive': return (<Tag>Archive</Tag>);
            default: return (<Tag>{text}</Tag>);
          }
        }
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <Popconfirm
              title="Are you sure delete this entry?"
              onConfirm={e => this.confirmDeleteEntry(record._id)}
              onCancel={this.cancel}
              okText="Yes"
              cancelText="No"
            >
              <a href="#">Delete</a>
            </Popconfirm>
          </span>
        ),
      }
    ];

    const data = _.map(entries, (entry, i) => {
      const contentType = getContentType(contentTypes, entry.contentTypeId);
      return {
        _id: entry._id,
        key: i,
        title: _.get(entry, `fields.${contentType.displayField}`),
        contentType: contentType.name,
        updated: entry.updatedAt,
        by: '',
        status: entry.status,
      }
    });

    const addEntryMenu = (
      <Menu onClick={this.handleClickAddEntry}>
      {
        _.map(contentTypes, (ct) =>
          <Menu.Item key={ct._id} contentTypeId={ct._id}>{ct.name}</Menu.Item>
        )
      }
      </Menu>
    );

    const deliveryKey = _.get(space, 'apiKeys.0.deliveryKey');
    const actionMenus = (
      <Menu>
        <Menu.Item key="export">
          <a href={`${API_PATH}spaces/${space._id}/entries?access_token=${deliveryKey}`} target="_blank">Preview JSON</a>
        </Menu.Item>
      </Menu>
    );

    const contentTypesList = contentTypes.map(value => <Option value={value._id}>{value.name}</Option>);

    return (
      <div>
        <Row>
          <Col span={24}>
            <div style={{ marginBottom: 20, background: '#f7f7f7', padding: 20, }}>
              <Row gutter={8}>
                <Col span={6}>
                  <span>Content Type </span>
                  <Select defaultValue="all" style={{ width: 120 }} onChange={this.handleFilterContentTypes}>
                    <Option value="all">All</Option>
                    {contentTypesList}
                  </Select>
                </Col>
                <Col span={6}>
                  <span>Status </span>
                  <Select defaultValue="all" style={{ width: 120 }} onChange={this.handleFilterStatus}>
                    <Option value="all">All</Option>
                    <Option value="draft">Draft</Option>
                    <Option value="publish">Publish</Option>
                  </Select>
                </Col>
                <Col span={6}>
                  <span>Search </span>
                  <Search
                    placeholder="Filter entries"
                    style={{ width: 200 }}
                    onKeyUp={this.handleFilterInput}
                  />
                </Col>
                <Col span={6}>
                  <Button type="primary" icon="search" onClick={this.handleFilter}>Search</Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <div style={{ marginBottom: 20 }}>
              <Dropdown overlay={addEntryMenu}>
                <Button type="primary">
                  <Icon type="plus" /> Add Entry
                </Button>
              </Dropdown>
            </div>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Dropdown overlay={actionMenus}>
              <a className="ant-dropdown-link" href="#">
                Actions <Icon type="down" />
              </a>
            </Dropdown>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table columns={columns} dataSource={data} />
          </Col>
        </Row>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    space: getActiveSpace(state, ownProps),
    entries: getEntryVisibleList(state, ownProps),
  }
}

const actions = {
  getEntryInSpace: Actions.getEntryInSpace,
  createEmptyEntry: Actions.createEmptyEntry,
  deleteEntry: Actions.deleteEntry,
  filterEntry: Actions.filterEntry,
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryList);
