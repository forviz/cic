import React, { Component } from 'react';
import _ from 'lodash';
import { Button, Icon, Row, Col, Form } from 'antd';

export default (InputComponent) => {
  return class extends Component {

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

    render() {
      const { value } = this.props;
      return (
        <div>
          {
            _.map(value, (val, i) =>
              <Row key={`row-${i}`}>
                <Col span={18}>
                  <InputComponent value={val} onChange={e => this.edit(e.target.value, i)} />
                </Col>
                <Col span={6}>
                  <Icon
                    className="dynamic-delete-button"
                    style={{
                      position: 'relative',
                      top: 4,
                      fontSize: 24,
                      color: '#999',
                      transition: 'all .3s',
                      marginLeft: 8,
                    }}
                    type="minus-circle-o"
                    disabled={value.length === 1}
                    onClick={() => this.remove(i)}
                  />
                </Col>
              </Row>
            )
          }
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
