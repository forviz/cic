import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Input, Select, Radio } from 'antd';

const RadioGroup = Radio.Group;
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

class InputText extends Component {

  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    onChange: PropTypes.func,
  }

  render() {
    const { field, value, onChange } = this.props;
    const appearance = _.get(field, 'appearance', 'single-line');
    switch (appearance) {
      case 'dropdown': {
        const options = _.get(field, 'src.validations.in', []);
        return (
          <Select value={value} onChange={onChange}>
            {options.map(option => <Select.Option key={option}>{option}</Select.Option>)}
          </Select>
        );
      }

      case 'radio': {
        const options = _.get(field, 'src.validations.in', []);
        return (
          <RadioGroup onChange={onChange} value={value}>
            {options.map(option => <Radio style={radioStyle} key={option} value={option}>{option}</Radio>)}
          </RadioGroup>
        );
      }
      default:return (<Input value={value} onChange={onChange} />);
    }
  }
}

export default InputText;
