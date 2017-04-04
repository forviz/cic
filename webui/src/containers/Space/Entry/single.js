import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input, Form, Button } from 'antd';

import * as Actions from './actions';

class EntrySingle extends Component {

  static propTypes = {
    fields: PropTypes.array,
  }

  constructor(props) {
    super(props);

    this.state = {
      fields: [],
    };

  }

  componentWillReceiveProps(nextProps) {
    const { space } = nextProps;
    const entryId = nextProps.params.entryId;
    const entry = _.find(space.entries, entry => entry._id === entryId);
    if (entry) {
      const { fields } = entry;

      this.state = {
        contentType: entry.contentType,
        fields: fields,
      }
    }
  }

  handleInputChange = (name, value) => {
    this.setState({
      fields: _.assign({}, this.state.fields, {
        [name]: value,
      }),
    });
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    const spaceId = this.props.params.spaceId;
    const entryId = this.props.params.entryId;
    console.log('submit form', spaceId, entryId);

    const { updateEntry } = this.props.actions;
    updateEntry(spaceId, entryId, this.state.contentType, this.state.fields);

    return false;
  }

  render() {

    console.log('render', this.props);
    const { fields } = this.state;

    return (
      <div>
        <div>
          <Form>
            <Form.Item
              label="Title"
              validateStatus="error"
              help="Should be combination of numbers & alphabets"
            >
              <Input key="title" name="title" value={this.state.fields['title']} onChange={this.handleInputChange} />
            </Form.Item>
            {
              !_.isEmpty(fields) &&
                _.map(fields, (value, key) =>
                  <Form.Item
                    label="Title"
                    validateStatus="error"
                    help="Should be combination of numbers & alphabets"
                  >
                    <Input key={key} name={key} value={value} onChange={this.handleInputChange} />
                  </Form.Item>
                )
            }
            <Button type="primary" onClick={this.handleSubmitForm}>Save</Button>
          </Form>
        </div>
      </div>
    );
  }
}

const actions = {
  updateEntry: Actions.updateEntry,
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(undefined, mapDispatchToProps)(EntrySingle);
