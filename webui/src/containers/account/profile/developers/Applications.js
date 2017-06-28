import React, { Component } from 'react';
import T from 'prop-types';
import { Table, Row, Col, Icon, Popconfirm } from 'antd';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ModalNewApplication from './ModalNewApplication';

import * as MyApplicationActions from '../../../../actions/myApplication';

class DeveloperApplicationsPage extends Component {

  static propTypes = {
    applications: T.arrayOf(T.shape({
      _id: T.string,
      name: T.string,
      description: T.string,
      redirectURL: T.string,
      read: T.boolean,
      write: T.boolean,
    })),
    actions: T.shape({
      fetchApplication: T.func,
      deleteApplication: T.func,
    }).isRequired,
  }

  static defaultProps = {
    applications: [],
  }

  componentDidMount() {
    this.getApplication();
  }

  getApplication = () => {
    const { fetchApplication } = this.props.actions;
    fetchApplication();
  }

  handleDelete = (id) => {
    const { deleteApplication } = this.props.actions;
    deleteApplication(id);
  };

  render() {
    const { applications } = this.props;

    if (Object.keys(applications).length === 0) return <div />;

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
      title: 'Redirect URL',
      dataIndex: 'redirectURL',
      key: 'redirectURL',
      render: text => <a href={text}>{text}</a>,
    }, {
      title: 'Operation',
      dataIndex: '_id',
      render: (text) => {
        return (
          Object.keys(applications).length > 1 ?
          (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(text)}>
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
          dataSource={applications}
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
    applications: state.entities.application.entities,
  };
};

const actions = {
  fetchApplication: MyApplicationActions.fetchApplication,
  deleteApplication: MyApplicationActions.deleteApplication,
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeveloperApplicationsPage);
