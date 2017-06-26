import _ from 'lodash';
import React, { Component } from 'react';
import T from 'prop-types';
import { Table, Row, Col, Icon, Popconfirm } from 'antd';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ModalNewApplication from './ModalNewApplication';

class DeveloperApplicationsPage extends Component {

  static propTypes = {
    applications: T.arrayOf(T.shape({
      _id: T.string,
      name: T.string,
    })),
  }

  static defaultProps = {
    applications: [],
  }

  state = {
    applications: [],
  }

  componentDidMount() {
    this.getApplication();
  }

  onDelete = (id) => {
    fetch(`http://localhost:4000/v1/application/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then((response) => {
      console.log('response ', response);
      this.getApplication();
    }).catch((e) => {
      console.log('error', e);
    });
  }

  getApplication = () => {
    fetch('http://localhost:4000/v1/application', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then((response) => {
      console.log('response ', response);
      this.setState({
        applications: response.items,
      });
    }).catch((e) => {
      console.log('error', e);
    });
  }

  render() {
    const { applications } = this.state;
    const dataSource = _.map(applications, (app) => {
      return {
        name: app.name,
        description: app.description,
        read: app.read,
        write: app.write,
        created: app.createdAt,
        operation: app._id,
      };
    });

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Read',
      dataIndex: 'read',
      key: 'read',
      render: value => (value ? <Icon type="check" /> : <Icon type="close" />),
    }, {
      title: 'Write',
      dataIndex: 'write',
      key: 'write',
      render: value => (value ? <Icon type="check" /> : <Icon type="close" />),
    }, {
      title: 'Created At',
      dataIndex: 'created',
      key: 'created',
    }, {
      title: 'operation',
      dataIndex: 'operation',
      render: (text) => {
        return (
          this.state.applications.length > 1 ?
          (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(text)}>
              <a href="###">Delete</a>
            </Popconfirm>
          ) : null
        );
      },
    },
    ];

    return (
      <div>
        <Row>
          <Col span={12} style={{ marginBottom: 20 }}>
            <ModalNewApplication onUpdate={this.getApplication} />
          </Col>
        </Row>
        <Table
          dataSource={dataSource}
          columns={columns}
          expandedRowRender={record => <p>{record.description}</p>}
        />
      </div>
    );
  }
}

/* eslint-disable no-unused-vars */
const mapStateToProps = (state) => {
  return {
    applications: [
      {
        name: 'Loading',
      },
    ],
  };
};

const actions = {};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeveloperApplicationsPage);
