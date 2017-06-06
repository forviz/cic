import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Select, Spin, Tag, Cascader } from 'antd';
import * as EntryActions from '../../actions/entries';
import { getActiveSpaceFromId, getSpaceEntriesFromSpaceId } from '../../selectors';

const Option = Select.Option;

class LinkSelect extends Component {

  static propTypes = {
    spaceId: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.lastFetchId = 0;
  }

  state = {
    data: [],
    value: [],
    fetching: false,
  }

  componentDidMount() {
    const { spaceId, getEntryInSpace } = this.props;
    getEntryInSpace(spaceId);
  }

  handleChange = (key) => {
    this.props.onChange({ type: 'Link', linkType: 'Entry', _id: key });
  }

  render() {
    const { options, value, space, entries } = this.props;
    const { fetching, data } = this.state;

    return (<Cascader options={options} onChange={this.handleChange} placeholder="Please select" />);
    /*
    return (
      <Select
        size="large"
        value={value._id}
        placeholder="Select Entry"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchUser}
        onChange={this.handleChange}
      >
        {entries.map((entry) =>
          <Option key={entry._id}>
            <Tag color="green">{_.get(entry, 'contentType.name', 'Unknown')}</Tag> {_.get(entry, `fields.${_.get(entry, 'contentType.displayField')}`)}
          </Option>)}
      </Select>
    );*/
  }
}

const mapStateToProps = (state, ownProps) => {

  const linkContentType = _.compact(_.get(ownProps, 'field.src.validations.linkContentType', []));

  // Get All Entries
  const allEntries = getSpaceEntriesFromSpaceId(state, ownProps.spaceId);

  // Get Space
  const space = getActiveSpaceFromId(state, ownProps.spaceId);

  // Get ContentTypes
  const spaceContentTypes = space.contentTypes;

  const inputOptions = _.map(spaceContentTypes, (ct) => {
    const ctIsEisabled = linkContentType.length === 0 || _.includes(linkContentType, ct.identifier);
    return {
      value: ct._id,
      label: ct.name,
      disabled: !ctIsEisabled,
      children: _.map(_.filter(allEntries, entry => entry.contentTypeId === ct._id), (entry) => {
        return {
          value: entry._id,
          label: _.get(entry, `fields.${ct.displayField}`),
        };
      }),
    };
  });

  return {
    value: ownProps.value,
    options: inputOptions,
    space: getActiveSpaceFromId(state, ownProps.spaceId),
  };
}
const actions = {
  getEntryInSpace: EntryActions.getEntryInSpace,
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkSelect);
