import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Icon, Card, Row, Col } from 'antd';

class Welcome extends Component {

  render() {
    return (
      <div style={{ padding: 80 }}>
        <Row type="flex" justify="center">
          <Col span={12}>
            <Card title="Welcome">
              <p>Welcome user</p>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Welcome;
