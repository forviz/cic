import React, { Component } from 'react';
import T from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'antd';
import * as Actions from './actions';
import * as EntryActions from '../../../actions/entries';
import { getSpaceId, getEntryId, getActiveSpace, getActiveEntry } from '../../../selectors';

import EntryEditorForm from '../../../components/EntryEditorForm';

class EntrySingle extends Component {

  static propTypes = {
    spaceId: T.string.isRequired,
    entryId: T.string.isRequired,
    entry: T.shape({
      _id: T.string,
      fields: T.array,
    }),
    contentType: T.shape({
      _id: T.string,
    }),
    actions: T.shape({
      getEntry: T.func,
      updateEntry: T.func,
    }).isRequired,
  }

  static defaultProps = {
    fields: [],
    entry: {
      _id: '',
      fields: [],
    },
    contentType: undefined,
  }

  componentDidMount = () => {
    const { spaceId } = this.props;
    const { getEntry } = this.props.actions;
    getEntry(spaceId, this.props.entryId);
  }

  handleSubmitForm = (values, saveStatus) => {
    const { spaceId, entryId, contentType } = this.props;
    const { updateEntry } = this.props.actions;
    updateEntry(spaceId, entryId, contentType, values, saveStatus);
    return false;
  }

  render() {
    const { spaceId, contentType, entry } = this.props;
    if (!spaceId || !contentType || !entry) return (<div />);

    const entryTitle = _.get(entry, `fields.${contentType.displayField}`, 'No title');
    return (
      <Row>
        <Col>
          <h3>{entryTitle}</h3>
          <EntryEditorForm
            spaceId={spaceId}
            contentType={contentType}
            entry={entry}
            onSubmit={this.handleSubmitForm}
          />
        </Col>
      </Row>
    );
  }
}

const getEntryContentType = (entry, space) => {
  if (!entry || !space) return undefined;
  return _.find(space.contentTypes, ct => ct._id === entry.contentTypeId);
};

const mapStateToProps = (state, ownProps) => {
  const space = getActiveSpace(state, ownProps);
  const entry = getActiveEntry(state, ownProps);
  const contentType = getEntryContentType(entry, space);
  return {
    spaceId: getSpaceId(ownProps),
    entryId: getEntryId(ownProps),
    entry,
    contentType,
  };
};

const actions = {
  getEntry: EntryActions.getSingleEntryEntity,
  updateEntry: Actions.updateEntry,
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(EntrySingle);
