import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card } from 'antd';

import MediumEditor from './Medium';

class LongText extends Component {

  render () {
    const { value, onChange } = this.props;

    return (
      <Card>
        <Row type="flex" justify="center">
          <Col span={16}>
            <MediumEditor value={value} onChange={onChange} />
          </Col>
        </Row>
      </Card>
    );
    // return (
    //   <WYSIWYG value={value} onChange={onChange} />
    // )
    // return (
    //   <div>
    //     <Input type="textarea" rows={8} value={value} onChange={onChange} />
    //   </div>
    // )
  }
}

export default LongText;
