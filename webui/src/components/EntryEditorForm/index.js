import React, { Component } from 'react';
import { Menu, Dropdown, Form } from 'antd';
import _ from 'lodash';

import InputField from '../InputField';
import arrayToObject from '../../helpers/arrayToObject';

const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

const mapValidationToRules = (field) => {
  const validations = field.validations;

  const rules = [];

  if (field.required) rules.push({ required: true, message: 'Please enter value' });
  if (validations.regexp) {
    const regexp = new RegExp(_.get(validations, 'regexp.pattern'), _.get(validations, 'regexp.flag', 'ig'));
    rules.push({ pattern: regexp, message: 'Wrong Pattern' });
  }
  if (validations.in && _.size(validations.in) > 0) {
    const inString = _.join(_.get(validations, 'in'), ',');
    rules.push({ type: 'enum', enum: _.get(validations, 'in'), message: `Must be one of ${inString}` });
  }
  return rules;
};

class EntryEditorForm extends Component {

  state = {
    prestine: true,
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleFieldChange = (e) => {
    if (this.state.prestine) {
      this.setState({
        prestine: false,
      });
    }
  }

  handleSubmit = (saveStatus = 'publish') => {
    console.log('status', saveStatus);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // const valuesWithStatus = { ...values, status : saveStatus }
        const { onSubmit } = this.props;
        onSubmit(values, saveStatus);
      }
    });
  }

  renderSaveButton = (entryStatus) => {
    const { getFieldsError } = this.props.form;

    let primaryButton = { status: '', label: '' };
    let secondaryButtons = [{ status: '', label: '' }];

    switch (entryStatus) {
      case 'draft':
        primaryButton = { status: 'publish', label: 'Publish' };
        secondaryButtons = [{ status: 'archive', label: 'Save to Archive' }];
        break;
      case 'archive':
        primaryButton = { status: 'publish', label: 'Unarchive' };
        secondaryButtons = [{ status: 'publish', label: 'Published' }];
        break;
      case 'publish':
      default:
        primaryButton = {
          status: 'publish',
          label: this.state.prestine ? 'Change status' : 'Publish changes',
        };
        secondaryButtons = [
          { status: 'archive', label: 'Archived' },
          { status: 'draft', label: 'Draft' },
        ];
        break;
    }

    const menu = (
      <Menu onClick={item => this.handleSubmit(item.key)}>
        {_.map(secondaryButtons, btn => <Menu.Item key={btn.status}>{btn.label}</Menu.Item>)}
      </Menu>
    );
    return (
      <Dropdown.Button
        type="primary"
        onClick={e => this.handleSubmit(primaryButton.status, e)}
        overlay={menu}
        disabled={hasErrors(getFieldsError())}
      >
        {primaryButton.label}
      </Dropdown.Button>
    );
  }

  render() {
    const { spaceId, contentType, entry } = this.props;
    const fields = _.mapValues(arrayToObject(contentType.fields, 'identifier'), (field) => {
      const _isMultple = _.get(field, 'type') === 'Array';
      return {
        label: field.name,
        type: _isMultple ? _.get(field, 'items.type') : field.type,
        multiple: _isMultple,
        value: _.get(entry, `fields.${field.identifier}`, ''),
        identifier: field.identifier,
        rules: mapValidationToRules(field),
        appearance: field.appearance,
        src: field,
      }
    });

    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="horizontal">
        {
          _.map(fields, (field, identifier) =>
            (<Form.Item
              label={field.label}
              key={field.identifier}
            >
              {getFieldDecorator(identifier, {
                initialValue: field.value,
                rules: field.rules,
                onChange: this.handleFieldChange,
              })(
                <InputField field={field} spaceId={spaceId} />
              )}
            </Form.Item>)
          )
        }
        <Form.Item>
          <p>status: {entry.status}</p>
          {this.renderSaveButton(entry.status)}
        </Form.Item>
      </Form>
    );
  }
}


export default Form.create({})(EntryEditorForm);
