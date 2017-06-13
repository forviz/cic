import _ from 'lodash';
import React, {Component} from 'react';
import {Table, Button} from 'antd';
import {
  Link, Route
} from 'react-router-dom'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';
import { getUserOrganizations } from '../../../selectors';
import '../../../styles/style.css';

class Organization extends Component{




	render(){
    console.log("this.props:: ", this.props);
    const organizations = this.props.organizationsProp;

    const dataSource = _.map(organizations, org => {
      return {
        name: org.name,
        invited: 'Today',
      }
    });

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Invited At',
      dataIndex: 'invited',
      key: 'invitedA',
    }, {
      title: 'Action',
      dataIndex: 'action',
      key: 'actionA',
    }];


    console.log('Organization', this.props);

		return(
      <div>


        <br/><br/>
  			<div><h2>Organization</h2></div><br/>
        <Table dataSource={dataSource} columns={columns}/>

        <Link to="/account/profile/addnew">New Organization</Link>
        <Button type="danger" onClick={this.props.actions.leaveOrganization}>Delete Organization</Button>


      </div>

		)
	}
}

//<Link to="/account/profile/addnew">New Organization</Link>
//<Button key="btnNewOrganiztion" className="pin-btnorganization" type="primary" onClick={this.props.actions.createNewOrganization}>New Organization</Button>
//<Button key="btnNewOrganiztion" className="pin-btnorganization" type="primary"><Link to="/account/profile/addnew">New Organization</Link></Button>

//export default Organization;
const mapStateToProps = (state, ownProps) => { // map dataManager
  console.log('mapStateToProps', state);
  const organizations = state.entities.organizations.entities;
  return {
    // organizationsProp: organizations,
    organizationsProp: getUserOrganizations(state),
  }
}

const actions = {  // all action that involved
  createNewOrganization: Actions.createNewOrganization,
  leaveOrganization: Actions.leaveOrganization
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Organization);
