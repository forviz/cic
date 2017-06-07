import React from 'react';
import T from 'prop-types';
import { Row, Col, Card } from 'antd';

import MediumEditor from './Medium';

const LongText = (props) => {
  const { value, onChange } = props;
  return (
    <Card>
      <Row type="flex" justify="center">
        <Col span={16}>
          <MediumEditor value={value} onChange={onChange} />
        </Col>
      </Row>
    </Card>
  );
};

LongText.propTypes = {
  value: T.string,
  onChange: T.func,
};

LongText.defaultProps = {
  value: '',
  onChange: undefined,
};

export default LongText;
