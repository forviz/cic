import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { message } from 'antd';
import * as Actions from './actions';

import { getActiveSpace, getEntryId, getActiveEntry } from '../../../selectors';

import EntryEditorForm from '../../../components/EntryEditorForm';

class EntrySingle extends Component {

  static propTypes = {
    fields: PropTypes.array,
  }

  componentDidMount = () => {
    if (!this.props.entry) {
      const { space } = this.props;
      const { getSingleEntry } = this.props.actions;
      getSingleEntry(space._id, this.props.entryId);
    }
  }

  handleSubmitForm = (values) => {
    const { space, entry, contentType } = this.props;
    const spaceId = space._id;
    const entryId = entry._id;
    console.log('submit form', spaceId, entryId, values);

    const { updateEntry } = this.props.actions;
    updateEntry(spaceId, entryId, contentType, values)
    .then(res => {
      message.info('Entry saved');
    })

    return false;
  }

  render() {

    console.log('render', this.props);
    const { space, contentType, entry } = this.props;
    if (!space || !contentType || !entry) return (<div />);

    return (
      <div>
        <div>
          <h1>Test</h1>
          <EntryEditorForm contentType={contentType} entry={entry} onSubmit={this.handleSubmitForm} />
        </div>
      </div>
    );
  }
}

const getEntryContentType = (entry, space) => {
  if (!entry || !space) return undefined;
  return _.find(space.contentTypes, ct => ct._id === entry.contentTypeId);
}

const mapStateToProps = (state, ownProps) => {
  console.log('mapStateToProps', state);
  const space = getActiveSpace(state, ownProps);
  const entry = getActiveEntry(state, ownProps);
  return {
    space: space,
    contentType: getEntryContentType(entry, space),
    entryId: getEntryId(ownProps),
    entry: entry,
  }
}

const actions = {
  getSingleEntry: Actions.getSingleEntry,
  updateEntry: Actions.updateEntry,
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntrySingle);
