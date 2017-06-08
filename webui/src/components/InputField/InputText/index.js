import React from 'react';
import T from 'prop-types';
import _ from 'lodash';
import { Input, Select, Radio } from 'antd';

const RadioGroup = Radio.Group;
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

const InputText = (props) => {
  const { field, value, onChange } = props;
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
};

InputText.propTypes = {
  value: T.oneOfType([
    T.string,
    T.array,
  ]),
  field: T.object,
  onChange: T.func,
};

InputText.defaultProps = {
  value: '',
  field: {},
  onChange: undefined,
};

export default InputText;
