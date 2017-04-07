import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';
import _ from 'lodash';

import { Button, Table, Icon, Col, Row, Menu, Dropdown } from 'antd';
import { getActiveSpace, getSpaceEntries } from '../../../selectors';

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

  handleClickAddEntry = (a, b, c) => {
    const contentTypeId = a.item.props.contentTypeId;
    const { space } = this.props;
    const { createEmptyEntry } = this.props.actions;

    createEmptyEntry(space._id, contentTypeId);
  }

  render() {
    const { space, entries } = this.props;
    if (!space) return (<div />);

    console.log('render', entries);

    const { contentTypes } = space;

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
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
    ];

    const data = _.map(entries, (entry, i) => ({
      _id: entry,
      key: i,
      name: _.get(entry, 'fields.title'),
      contentType: entry.contentTypeId,
      updated: entry.updatedAt,
      by: '',
      status: entry.status,
    }));

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
              <Button style={{ marginLeft: 8 }}>
                <Icon type="plus" /> Add Entry
              </Button>
            </Dropdown>
            { /*<Button type="primary" onClick={this.handleClickAddEntry}><Icon type="plus" /> Add Entry</Button> */ }
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
