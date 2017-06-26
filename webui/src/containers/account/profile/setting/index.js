import React, { Component } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Avatar, Button, Row, Col } from 'antd';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';
import SubHeader from '../../../../components/SubHeader';
import { getCurrentUser, getUserOrganizations } from '../../../../selectors';

const AvatarWrapper = styled.div`
  float: left;
  margin-right: 10px;
`;

const Text = styled.div`
  line-height: 1.7;
`;

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
        <SubHeader title="User Details" />
        <Row>
          <AvatarWrapper>
            <Avatar size="large" icon="user" shape="square" />
          </AvatarWrapper>
          <Col span={6}>
            <Text>{name}</Text>
            <Text>{email}</Text>
            <Button type="editUser">Edit User</Button>
          </Col>
        </Row>
        { /*
        <Row>
          <SubHeader title="Identities" />
          <p>You have signed in with these services:</p>
          <p>&nbsp;</p>
          <Timeline>
            <Timeline.Item color="#dd4b39">Google</Timeline.Item>
          </Timeline>
        </Row>
        <Row>
          <p>Add an identity:</p>
          <p>&nbsp;</p>
          <Timeline>
            <Timeline.Item color="#55ACEE">
              <Button type="primary">Twitter</Button>
            </Timeline.Item>
          </Timeline>
        </Row>
        */ }
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
