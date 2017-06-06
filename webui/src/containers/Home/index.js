import React, { Component } from 'react';
import T from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Link,
} from 'react-router-dom';
import { Card, Row, Col, Steps, Button, Tooltip } from 'antd';

import AuthService from '../../modules/auth/AuthService';
import * as SpaceActions from '../../actions/spaces';
import { getUser, getUserOrganizationsWithSpaces } from '../../selectors';

const Step = Steps.Step;

const mapStateToProps = state => ({
  userProfile: getUser(state),
  userOrganizations: getUserOrganizationsWithSpaces(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    createNewSpace: SpaceActions.createNewSpace,
  }, dispatch),
});

class Home extends Component {

  static propTypes = {
    userProfile: T.shape({
      email: T.string,
    }),
    userOrganizations: T.arrayOf(T.shape({
      _id: T.string,
      name: T.string,
    })),
    auth: T.instanceOf(AuthService).isRequired,
  }

  static defaultProps = {
    userProfile: {},
    userOrganizations: [],
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

  renderTooltip = (title, description) =>
    (<Tooltip placement="bottom" title="Click to enter space">
      <Card loading title={title} style={{ marginBottom: 16, textAlign: 'center' }}>
        {description}
      </Card>
    </Tooltip>);

  renderHomeForUser = (userProfile, userOrganizations) => {
    return _.map(userOrganizations, (org) => {
      const orgSpaces = _.map(_.compact(org.spaces), space =>
        (<Col span={8} key={space._id}>
          <Link to={`spaces/${space._id}/content_types`}>
            {this.renderTooltip(space.name, space.description)}
          </Link>
        </Col>)
      );

      return (
        <Row gutter={16} key={org._id}>
          <h3 style={{ marginBottom: 20 }}>{org.name}</h3>
          {orgSpaces}
        </Row>
      );
    });
  }

  render() {
    const { userProfile, userOrganizations } = this.props;
    const content = _.isEmpty(userProfile) ?
      this.renderHomeForGuest()
      :
      this.renderHomeForUser(userProfile, userOrganizations);
    return (
      <div style={{ padding: 40 }}>
        {content}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
