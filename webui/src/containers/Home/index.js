import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Card, Row, Col } from 'antd';

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
    }, dispatch),
  };
}
class Home extends Component {

  render() {

    return (
      <div style={{ padding: 80 }}>
        <Row type="flex" justify="center">
          <Col span={12}>
            <Card title="Home">
              <p>This is home</p>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
