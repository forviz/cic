import React, { Component } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import { Icon, Button, Table, Row, Col } from 'antd';

class EntryList extends Component {

  static propTypes = {

  }

  handleClickAddEntry = (contentTypeId) => {

  }

  render() {
    const { space } = this.props;
    if (!space) return (<div />);

    const { entries } = space;

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Link to={`/spaces/${space._id}/content_types/${record._id}`}>{text}</Link>,
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
      _id: entry._id,
      key: i,
      name: entry.name,
      contentType: entry.contentType,
      updated: '',
      by: '',
      status: '',
    }));

    return (
      <div>
        <div>
          <div style={{ marginBottom: 20 }}>
            <Button type="primary" onClick={this.handleClickAddEntry}><Icon type="plus" /> Add Entry</Button>
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

export default EntryList;
