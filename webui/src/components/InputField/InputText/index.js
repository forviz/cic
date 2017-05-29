import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Input } from 'antd';

class InputText extends Component {

  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    onChange: PropTypes.func,
  }


  render() {
    return (
      <Input {...this.props} />
    );
  }
}

export default InputText;
