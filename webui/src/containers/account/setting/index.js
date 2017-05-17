import _ from 'lodash';
import React, {Component} from 'react';
import { Button } from 'antd';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';
import {getCurrentUser} from '../../../selectors';

class AccountSetting extends Component{


  //const { email } = profile;
  // const email = profile.email; == const {email} = profile.email;
  // const firstName = profile.firstName;

	render(){

    console.log('settings', this.props);
    const { profile } = this.props.userProp;
    
    const {email, name }  = profile;

    

		return(
      <div>
        <br/><br/><h2>User Details</h2><br/>
        <div>{name}</div>
        <div>{email}</div>
        <br/><br/>
        <Button type="editUser">Edit User</Button>

      </div>
		)
	}
}

const mapStateToProps = (state, ownProps) => { // map dataManager
  console.log('mapStateToProps', state);
  //const userMail = state.entities.settings.entities;
  const user = getCurrentUser(state); //../../../selectors
  return {
    userProp: user,
  }
}

const actions = {  // all action that involved
  editName: Actions.editName,
  editEmail: Actions.editEmail
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSetting);