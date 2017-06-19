import _ from 'lodash';
import React, { Component } from 'react';
import T from 'prop-types';
import { Icon, Layout, Table, Button, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getOrganizationEntity } from '../../../../selectors/organizations';
import InviteUserToOrganizationModal from '../../../../components/InviteUserToOrganizationModal';
import { receiveOrganizationMembers } from '../../../../actions/organizations';
import { fetchCreateMember, fetchRemoveMember, fetchOrganizationMembers } from '../../../../api/cic/organizations';

const { Content, Sider } = Layout;

const mapStateToProps = (state, ownProps) => {
  const orgId = ownProps.match.params.organizationId;
  const organization = getOrganizationEntity(state, ownProps.match.params.organizationId);
  if (organization) {
    return {
      organizationId: orgId,
      users: organization.members,
    };
  }
  return {
    users: [],
  };
};
const actions = {
  inviteUser: (organizationId, email, { role }) => {
    return (dispatch) => {
      return fetchCreateMember(organizationId, email, { role })
      .then(() => {
        fetchOrganizationMembers(organizationId)
        .then(({ items }) => {
          dispatch(receiveOrganizationMembers(organizationId, items));
        });
      });
    };
  },
  removeUser: (organizationId, userId) => {
    return (dispatch) => {
      return fetchRemoveMember(organizationId, userId)
      .then(() => {
        fetchOrganizationMembers(organizationId)
        .then(({ items }) => {
          dispatch(receiveOrganizationMembers(organizationId, items));
        });
      });
    };
  },
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

class OrganizationUserPage extends Component {

  static propTypes = {
    users: T.arrayOf(T.shape({
      email: T.string,
      name: T.string,
    })),
  }

  static defaultProps = {
    users: {
      email: '',
      name: '',
    },
  }

  state = {
    modalVisible: false,
  }

  createFormRef = (form) => {
    this.form = form;
  }

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }

  handleRemoveUser = (userId) => {
    const { organizationId } = this.props;
    const { removeUser } = this.props.actions;
    removeUser(organizationId, userId);
  }

  handleSubmitInvitation = (values) => {
    const { organizationId } = this.props;
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const { inviteUser } = this.props.actions;
      inviteUser(organizationId, values.email, { role: values.role })
      .then(() => {
        form.resetFields();
        this.setState({ modalVisible: false });
      });
    });
  }

  render() {
    const { organizationId, users } = this.props;
    console.log('members', users);
    const { modalVisible } = this.state;

    const dataSource = _.map(users, (user) => {
      return {
        _id: user._id,
        name: _.get(user, 'profile.name', 'No name'),
        email: _.get(user, 'profile.email', ''),
        role: user.role,
        invitedAt: user.createdAt,
      };
    });

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    }, {
      title: 'Organization role',
      dataIndex: 'role',
      key: 'role',
    }, {
      title: 'Invited At',
      dataIndex: 'invitedAt',
      key: 'invitedAt',
    }, {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Popconfirm
            title={`Remove User ${record._id}?`}
            onConfirm={e => this.handleRemoveUser(record._id, e)}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Remove User</a>
          </Popconfirm>
        </span>
      ),
    }];

    return (
      <Layout>
        <Content style={{ background: '#ffffff', paddingRight: 24 }}>
          <Table dataSource={dataSource} columns={columns} />
        </Content>
        <Sider width={250} style={{ background: '#f7f7f7', padding: 24 }}>
          <h4>Invite User</h4>
          <Button type="primary" onClick={() => this.setState({ modalVisible: true })}><Icon type="plus" /> Invite User</Button>
        </Sider>
        <InviteUserToOrganizationModal
          ref={this.createFormRef}
          visible={modalVisible}
          onCancel={this.handleCancel}
          onSubmit={this.handleSubmitInvitation}
        />
      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationUserPage);
