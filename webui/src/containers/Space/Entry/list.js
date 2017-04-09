import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';
import _ from 'lodash';

import { Button, Table, Icon, Col, Row, Menu, Dropdown, message, Popconfirm } from 'antd';
import { getActiveSpace, getSpaceEntries } from '../../../selectors';

const getContentType = (contentTypes, contentTypeId) => {
  return _.find(contentTypes, ct => ct._id === contentTypeId);
};

class EntryList extends Component {

  static propTypes = {
    space: PropTypes.object,
  }

  componentDidMount = () => {
    if (!this.props.entry) {
      const { space } = this.props;
      const { getEntryInSpace } = this.props.actions;
      getEntryInSpace(space._id);
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

    return (
      <div>
        <div>
          <div style={{ marginBottom: 20 }}>
            <Dropdown overlay={addEntryMenu}>
              <Button type="primary">
                <Icon type="plus" /> Add Entry
              </Button>
            </Dropdown>
          </div>
        </div>
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
    entries: getSpaceEntries(state, ownProps),
  }
}

const actions = {
  getEntryInSpace: Actions.getEntryInSpace,
  createEmptyEntry: Actions.createEmptyEntry,
  deleteEntry: Actions.deleteEntry,
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryList);
