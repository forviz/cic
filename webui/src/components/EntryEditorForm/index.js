import React, { Component } from 'react';
import _ from 'lodash';

import InputField from '../InputField';
import { Menu, Dropdown, Form } from 'antd';

import arrayToObject from '../../helpers/arrayToObject';

const mapValidationToRules = (field) => {
  const validations = field.validations;

  const rules = [];

  if (field.required) rules.push({ required: true, message: 'Please enter value' });
  if (validations.regexp) {
    const regexp = new RegExp(_.get(validations, 'regexp.pattern'), _.get(validations, 'regexp.flag', 'ig'))
    rules.push({ pattern: regexp, message: 'Wrong Pattern' });
  }
  if (validations.in && _.size(validations.in) > 0) {
    const inString = _.join(_.get(validations, 'in'), ',');
    rules.push({ type: 'enum', enum: _.get(validations, 'in'), message: `Must be one of ${inString}` });
  }

  // console.log(rules);
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
    console.log('handleChange', e);
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
        onSubmit(values , saveStatus);
      }
    });
  }

  renderSaveButton(entryStatus) {
    switch (entryStatus ) {
      case 'draft': {
        const menu = (
          <Menu onClick={e => this.handleSubmit('archive')}>
            <Menu.Item key="archive">Save to Archive</Menu.Item>
          </Menu>
          );
        return(<Dropdown.Button type="primary" onClick={e => this.handleSubmit('publish')}  overlay={menu}>Publish </Dropdown.Button>)
      }
      case 'publish': {
        const menu = (
          <Menu onClick={(item, key, keyPath) => this.handleSubmit(item.key)}>
            <Menu.Item key="archive">Archived</Menu.Item>
            <Menu.Item key="draft">Draft</Menu.Item>
          </Menu>
          );

        const buttonLabel = this.state.prestine ? 'Change status' : 'Publish changes';
        return(
          <Dropdown.Button type="primary" onClick={e => this.handleSubmit('publish')}  overlay={menu}>{buttonLabel} </Dropdown.Button>
        );
      }
          case 'archive': {
        const menu = (
          <Menu onClick={e => this.handleSubmit('unarchive')}>
            <Menu.Item key="unarchive">Unarchive</Menu.Item>
          </Menu>
          );
        return(
          <Dropdown.Button type="primary" onClick={e => this.handleSubmit('publish')}  overlay={menu}>Unarchive</Dropdown.Button>
          )
      }
    }
  }

  render() {
    const { spaceId, contentType, entry } = this.props;
    const fields = _.mapValues(arrayToObject(contentType.fields, 'identifier'), field => {
      const _isMultple = _.get(field, 'type') === 'Array';
      return {
        label: field.name,
        type: _isMultple ? _.get(field, 'items.type') : field.type,
        multiple:  _isMultple,
        value: _.get(entry, `fields.${field.identifier}`, ''),
        identifier: field.identifier,
        rules: mapValidationToRules(field),
        appearance: field.appearance,
        src: field,
      }
    });

    const { getFieldDecorator, getFieldsError } = this.props.form;
    const menu = (
        <Menu >
          <Menu.Item key="1">Save as archive</Menu.Item>
        </Menu>
        );
    return (
      <Form layout="horizontal">
        {
          _.map(fields, (field, identifier) => {
            return (
              <Form.Item
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
              </Form.Item>
            );
          })
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
