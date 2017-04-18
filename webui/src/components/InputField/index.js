import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Input, InputNumber, DatePicker, Switch } from 'antd';
// import Uploader from '../Uploader';
import PicturesWall from '../Uploader/PicturesWall';
import LinkEntry from './LinkEntry';
import mapImageInfoToFile from '../../helpers/mapImageInfoToFile';


class InputField extends Component {

  render() {
    const { spaceId, value, onChange } = this.props;
    const type = _.get(this.props, 'field.type');
    switch (type) {
      case 'LongText': return (<Input type="textarea" rows={8} value={value} onChange={onChange} />);
      case 'Number': return (<InputNumber value={value} onChange={onChange} />);
      case 'Datetime': return (<DatePicker value={moment(value)} onChange={onChange} />);
      case 'Boolean': return (<Switch checked={value} onChange={onChange} />);
      case 'Media': return (<PicturesWall multiple={false} fileList={[value]} onChange={info => onChange(mapImageInfoToFile(info))} />);
      case 'Link': return (<LinkEntry spaceId={spaceId} value={value} onChange={onChange} />);
      default: return <Input value={value} onChange={onChange} />
    }
  }
}

export default InputField;
