import React, { Component } from 'react';
import _ from 'lodash';
import { Button, Icon, Row, Col, Form } from 'antd';

const iconStyle = {
  position: 'relative',
  top: 4,
  fontSize: 24,
  color: '#999',
  transition: 'all .3s',
  marginLeft: 8,
};

export default (InputComponent) => {
  return class extends Component {
    state = {
      values: [],
    }
    
    add = () => {
      const newValues = [...this.state.values, ''];
      this.handleChange(newValues);
    }

    edit = (inputValue, i) => {

      const newValues = _.map(this.state.values, (val, inputIndex) => {
        if (i === inputIndex) return inputValue;
        return val;
      });
      this.handleChange(newValues);
    }

    remove = (i) => {
      const newValues = _.filter(this.state.values, (val, index) => i !== index);
      this.handleChange(newValues);
    }

    submit = (values) => {
      this.props.onChange(values);
    }

    renderInputRow = (val, i) => {
      return (
        <Row key={`row-${i}`}>
          <Col span={18}>
            <InputComponent value={val} onChange={e => this.edit(e.target.value, i)} />
          </Col>
          <Col span={6}>
            <Icon
              className="dynamic-delete-button"
              style={iconStyle}
              type="minus-circle-o"
              disabled={i === 0}
              onClick={() => this.remove(i)}
            />
          </Col>
        </Row>
      );
    }

    render() {
      const { value } = this.props;
      return (
        <div>
          {_.map(value, (val, i) => this.renderInputRow(val, i))}
          <Row>
            <Col span={18}>
              <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
                <Icon type="plus" /> Add field
              </Button>
            </Col>
          </Row>
        </div>
      )
    }
  }
}
