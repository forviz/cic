import React, { Component } from 'react';
import T from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout, Button, Table, Icon, Col, Row, Menu, Dropdown, Popconfirm, Tag } from 'antd';

import EntryFilterBar from './EntryFilterBar';
import * as Actions from './actions';
import * as EntryActions from '../../../actions/entries';

import { getSpaceId, getActiveSpace, getSpaceEntries } from '../../../selectors';
import { cic } from '../../../App';

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const API_PATH = process.env.REACT_APP_API_PATH;

const getContentType = (contentTypes, contentTypeId) => {
  return _.find(contentTypes, ct => ct._id === contentTypeId);
};

class EntryList extends Component {

  static propTypes = {
    history: T.shape({
      push: T.func,
    }).isRequired,
    spaceId: T.string.isRequired,
    space: T.shape({
      _id: T.string,
    }).isRequired,
    entries: T.arrayOf(T.shape({
      _id: T.string,
    })),
    contentTypes: T.arrayOf(T.shape({
      _id: T.string,
    })),
    actions: T.shape({
      getEntries: T.func,
      createEmptyEntry: T.func,
      deleteEntry: T.func,
    }).isRequired,
  }

  static defaultProps = {
    entries: [],
    contentTypes: [],
  }

  componentDidMount = () => {
    const { spaceId } = this.props;
    const { getEntries } = this.props.actions;
    getEntries(spaceId);
  }

  handleSearch = ({ content_type, status, search }) => {
    const { spaceId } = this.props;
    const { getEntries } = this.props.actions;
    getEntries(spaceId, content_type, status, search);
  }

  handleClickAddEntry = (a) => {
    const contentTypeId = a.item.props.contentTypeId;
    const { spaceId, history } = this.props;
    const { createEmptyEntry } = this.props.actions;

    createEmptyEntry(spaceId, contentTypeId, history);
  }

  confirmDeleteEntry = (entryId) => {
    const { deleteEntry } = this.props.actions;
    const { space } = this.props;
    deleteEntry(space._id, entryId);
  }

  cancel = (e) => {
    console.log(e);
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
        render: (text) => {
          return moment(text).fromNow();
        },
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
        render: (text) => {
          switch (text) {
            case 'publish': return (<Tag color="green">Publish</Tag>);
            case 'draft': return (<Tag color="yellow">Draft</Tag>);
            case 'archive': return (<Tag>Archive</Tag>);
            default: return (<Tag>{text}</Tag>);
          }
        },
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <Popconfirm
              title="Are you sure delete this entry?"
              onConfirm={e => this.confirmDeleteEntry(record._id, e)}
              onCancel={this.cancel}
              okText="Yes"
              cancelText="No"
            >
              <a href="#">Delete</a>
            </Popconfirm>
          </span>
        ),
      },
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
      };
    });

    const addEntryMenu = (
      <Menu onClick={this.handleClickAddEntry}>
        {
          _.map(contentTypes, ct => <Menu.Item key={ct._id} contentTypeId={ct._id}>{ct.name}</Menu.Item>)
        }
      </Menu>
    );

    const deliveryKey = _.get(space, 'apiKeys.0.deliveryKey');
    const actionMenus = (
      <Menu>
        <Menu.Item key="export">
          <a
            href={`${API_PATH}/spaces/${space._id}/entries?access_token=${deliveryKey}`}
            target="_blank"
            rel="noopener noreferrer"
          >Preview JSON</a>
        </Menu.Item>
      </Menu>
    );

    return (
      <Layout style={{ background: '#fff' }}>
        <Content>
          <Row>
            <Col span={8}>
              <div style={{ marginBottom: 20 }}>
                <Dropdown overlay={addEntryMenu}>
                  <Button type="primary">
                    <Icon type="plus" /> Add Entry
                  </Button>
                </Dropdown>
              </div>
            </Col>
            <Col span={12}><EntryFilterBar contentTypes={contentTypes} onSearch={this.handleSearch} /></Col>
            <Col span={4} style={{ textAlign: 'right' }}>
              <Dropdown overlay={actionMenus}>
                <Button className="ant-dropdown-link">
                  Actions <Icon type="down" />
                </Button>
              </Dropdown>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table
                columns={columns}
                dataSource={data}
                pagination={{
                  simple: true,
                  showSizeChanger: true,
                }}
              />
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const ids = _.get(state, 'domain.entryList.items');
  const space = getActiveSpace(state, ownProps);
  return {
    spaceId: getSpaceId(ownProps),
    space: getActiveSpace(state, ownProps),
    contentTypes: _.get(space, 'contentTypes', []),
    entries: _.map(ids, entryId => _.get(state, `entities.entries.entities.${entryId}`)),
    // entries: getSpaceEntries(state, ownProps),
    filters: '',
  };
};

const actions = {
  getEntries: (spaceId, contentTypeId, status, search) => {
    return (dispatch) => {
      const query = {
        content_type: contentTypeId,
        status,
        'fields.title': search,
      };
      cic.getEntries(spaceId, query)
      .then((response) => {
        const entries = response.items;
        // Save Entries to entities/entries
        // TODO
        _.forEach(entries, (entry) => {
          dispatch({
            type: 'ENTITIES/ENTRY/RECEIVED',
            item: entry,
          });
        });

        // Save IDs to /domain/entryList
        dispatch({
          type: 'ENTRYLIST/ENTRIES/RECEIVED',
          entryIds: _.map(entries, item => item._id),
        });
      });
    };
  },
  createEmptyEntry: (spaceId, contentTypeId, his) => {
    return (dispatch) => {
      dispatch(Actions.createEmptyEntry(spaceId, contentTypeId))
      .then((res) => {
        const entryId = _.get(res, 'entry._id');
        his.push(`/spaces/${spaceId}/entries/${entryId}`);
      });
    };
  },
  deleteEntry: Actions.deleteEntry,
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(EntryList);
