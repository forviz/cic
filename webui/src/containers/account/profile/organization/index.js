import _ from 'lodash';
import React, { Component } from 'react';
import T from 'prop-types';
import { Table, Button } from 'antd';
import {
  Link,
} from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openNotification } from '../../../../actions/notification';

import { fetchCreateOrganization, fetchDeleteMemberOrganization } from '../../../../api/cic/organizations';
import CreateNewOrganizationModal from '../../../../components/CreateNewOrganizationModal';
import { getUserOrganizations } from '../../../../selectors';

class UserOrganizationsPage extends Component {

  static propTypes = {
    organizations: T.arrayOf(T.shape({
      _id: T.string,
      name: T.string,
    })),
    actions: T.shape({
      createNewOrganization: T.func,
      leaveOrganization: T.func,
    }).isRequired,
  }

  static defaultProps = {
    organizations: [],
  }

  state = {
    showCreateOrganizationModal: false,
  }

  createOrganizationFormRef = (form) => {
    this.form = form;
  }

  handleCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { createNewOrganization } = this.props.actions;
      createNewOrganization(values.name)
      .then(() => {
        form.resetFields();
        this.setState({ showCreateOrganizationModal: false });
      });
    });
  }

  closeModal = () => {
    this.setState({
      showCreateOrganizationModal: false,
    });
  }

  render() {
    const { organizations } = this.props;

    const dataSource = _.map(organizations, (org) => {
      return {
        _id: org._id,
        name: org.name,
        invited: 'Today',
      };
    });

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, org) => <Link to={`/account/organizations/${org._id}/subscription`}>{text}</Link>,
    }, {
      title: 'Invited At',
      dataIndex: 'invited',
      key: 'invitedA',
    }, {
      title: 'Action',
      dataIndex: 'action',
      key: 'actionA',
    }];

    return (
      <div>
        <Button type="primary" onClick={() => this.setState({ showCreateOrganizationModal: true })}>New Organization</Button>
        <Table dataSource={dataSource} columns={columns} />
        <CreateNewOrganizationModal
          ref={this.createOrganizationFormRef}
          visible={this.state.showCreateOrganizationModal}
          onSubmit={this.handleCreate}
          onCancel={this.closeModal}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => { // map dataManager
  return {
    organizations: getUserOrganizations(state),
  };
};

const actions = {  // all action that involved
  createNewOrganization: (name) => {
    return (dispatch) => {
      return fetchCreateOrganization(name)
      .then(() => {
        dispatch(openNotification('success', { message: 'Organization created' }));
      })
      .catch((error) => {
        dispatch(openNotification('error', { message: error.message }));
      });
    };
  },
  leaveOrganization: (organizationId, userId) => {
    return (dispatch) => {
      return fetchDeleteMemberOrganization(organizationId, userId)
      .then(() => {
        dispatch(openNotification('success', { message: 'Left Organization' }));
      })
      .catch((error) => {
        dispatch(openNotification('error', { message: error.message }));
      });
    };
  },
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserOrganizationsPage);
