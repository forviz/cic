import React, { Component } from 'react';
import T from 'prop-types';
import { Button } from 'antd';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';
import { getCurrentUser, getUserOrganizations } from '../../../../selectors';

class AccountSetting extends Component {

  static propTypes = {
    userProp: T.shape({
      email: T.string,
      name: T.string,
    }),
  }

  static defaultProps = {
    userProp: {
      email: '',
      name: '',
    },
  }

  render() {
    const { userProp } = this.props;

    if (!userProp) return (<div>No user </div>);
    const { email, name } = userProp;
    return (
      <div>
        <h2>User Details</h2>
        <div>{name}</div>
        <div>{email}</div>
        <Button type="editUser">Edit User</Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const user = getCurrentUser(state);
  return {
    userProp: user,
    userOrganizations: getUserOrganizations(state),
  };
};

const actions = {  // all action that involved
  editName: Actions.editName,
  editEmail: Actions.editEmail,
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountSetting);
