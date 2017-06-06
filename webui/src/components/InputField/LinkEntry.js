import React, { Component } from 'react';
import T from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Cascader } from 'antd';

import * as EntryActions from '../../actions/entries';
import { getActiveSpaceFromId, getSpaceEntriesFromSpaceId } from '../../selectors';

class LinkSelect extends Component {

  static propTypes = {
    value: T.array,
    options: T.arrayOf(T.shape({
      value: T.string,
      label: T.string,
    })),
    spaceId: T.string.isRequired,
    onChange: T.func.isRequired,
    getEntryInSpace: T.func.isRequired,
  }

  static defaultProps = {
    value: [],
    options: [],
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
    const { options, value } = this.props;
    return (<Cascader options={options} value={value} onChange={this.handleChange} placeholder="Please select" />);
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
};

const actions = {
  getEntryInSpace: EntryActions.getEntryInSpace,
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(LinkSelect);
