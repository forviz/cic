import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Link
} from 'react-router-dom'

import { Card, Row, Col, Steps, Button, Tooltip } from 'antd';
const Step = Steps.Step;
import * as SpaceActions from '../../actions/spaces';

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      createNewSpace: SpaceActions.createNewSpace,
    }, dispatch),
  };
};

class Home extends Component {

  showCreateSpaceModal = () => {

  }

  renderHomeForGuest = () => {

    const { auth } = this.props;
    return (
      <Row type="flex" justify="center">
        <Col span={18}>
          <Card title="Welcome to CIC, here are 3 easy steps to dig in.">
            <div className="custom-image" style={{ marginBottom: 20 }}>
              <img alt="example" width="100%" src={`${process.env.PUBLIC_URL}/img/hello-banner.gif`} />
            </div>
            <Steps current={0} style={{ marginBottom: 20 }}>
              <Step
                title="Design Content Model"
                description="First you'll need to define how your content structure will be like."
              />
              <Step
                title="Edit Content"
                description="After you've define content model. It's time to start add / edit them."
                />
              <Step
                title="Export"
                description="Exporting the content."
              />
            </Steps>
            <Row type="flex" justify="center">
              <Button type="primary" size="large" onClick={() => auth.login()}>Start</Button>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }

  renderHomeForUser = (userProfile, userSpaces) => {
    return (
      <Row gutter={16}>
        {
          _.map(userSpaces, space =>
            <Col span={8}>
              <Link to={`spaces/${space._id}/content_types`}>
                <Tooltip placement="bottom" title="Click to enter space">
                  <Card loading title={space.name} style={{ marginBottom: 16, textAlign: 'center' }}>
                    {space.description}
                  </Card>
                </Tooltip>
              </Link>
            </Col>
          )
        }
      </Row>
    )
  }

  render() {
    const { userProfile, userSpaces } = this.props;

    const homeContent =  _.isEmpty(userProfile) ? this.renderHomeForGuest() : this.renderHomeForUser(userProfile, userSpaces);
    return (
      <div style={{ padding: 40 }}>
        {homeContent}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
