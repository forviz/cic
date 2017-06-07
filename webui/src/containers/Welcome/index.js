import React from 'react';
import { Card, Row, Col } from 'antd';

const Welcome = () =>
  (<div style={{ padding: 80 }}>
    <Row type="flex" justify="center">
      <Col span={12}>
        <Card title="Welcome">
          <p>Welcome user</p>
        </Card>
      </Col>
    </Row>
  </div>);

export default Welcome;
