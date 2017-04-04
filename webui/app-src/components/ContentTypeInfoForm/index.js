import React, { Component, PropTypes } from 'react';

class ContentTypeInfoForm extends Component {

  propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
  }

  handleInputChange = (e) => {
    const { name } = this.props;
    this.props.onChange(name, e.target.value);
  }

  render() {
    const { name, value } = this.props;

    return (
      <div className="form-group">
        <label className="col-sm-2 control-label">{name}</label>
        <div className="col-sm-10">
          <input className="form-control" type="text" name={name} value={value} onChange={this.handleInputChange} />
        </div>
      </div>
    );
  }
}

export default ContentTypeInfoForm;
