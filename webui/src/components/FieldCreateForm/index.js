import React, { Component } from 'react';
import T from 'prop-types';
import _ from 'lodash';

import { Modal, Form, Select, Checkbox, Input, Switch, Row, Col, Menu, Icon, Radio, Tabs } from 'antd';
import EditableTagGroup from '../EditableTagGroup';
import Pattern from '../../helpers/regex-pattern';

const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const getLinkContentType = model => _.get(model, 'validations.linkContentType', []);
const getValidationRangeMin = model => _.get(model, 'validations.range.min', '');
const getValidationRangeMax = model => _.get(model, 'validations.range.max', '');
const getValidationPattern = model => _.get(model, 'validations.regexp.pattern', '');
const getValidationOptions = model => _.get(model, 'validations.in', []);

const shouldCheckValidationRange = (model) => {
  const minValue = getValidationRangeMin(model);
  const maxValue = getValidationRangeMax(model);
  return minValue || maxValue;
};

const mapFieldsToProps = (fieldsValue) => {
  const type = _.head(fieldsValue.type);
  const typeObj = fieldsValue.isMultiple !== true ? { type } : { type: 'Array', items: { type } };
  return {
    ..._.pick(fieldsValue, ['_id', 'name', 'identifier', 'required', 'isDisplayField', 'isMultiple']),
    ...typeObj,
    validations: {
      linkContentType: _.get(fieldsValue, 'linkContentType', []),
      in: _.get(fieldsValue, 'validations-options', []),
      linkMimetypeGroup: '',
      size: '',
      range: {
        min: _.toNumber(_.get(fieldsValue, 'validations-limit-min')),
        max: _.toNumber(_.get(fieldsValue, 'validations-limit-max')),
      },
      regexp: {
        pattern: _.get(fieldsValue, 'validations-pattern'),
        flags: _.get(fieldsValue, 'validations-pattern-flags'),
      },
      unique: false,
    },
    appearance: _.get(fieldsValue, 'appearance'),
    helpText: _.get(fieldsValue, 'helpText'),
  };
};

const mapPropsToFields = (props) => {
  const model = props.field;
  let _type = 'Text';
  if (model) _type = _.get(model, 'type') !== 'Array' ? _.get(model, 'type') : _.get(model, 'items.type');
  const fields = {
    _id: {
      value: _.get(model, '_id', ''),
    },
    type: {
      value: [_type],
    },
    isDisplayField: {
      value: _.get(model, 'isDisplayField'),
    },
    isMultiple: {
      value: _.get(model, 'type') === 'Array',
    },
    name: {
      value: _.get(model, 'name', ''),
    },
    identifier: {
      value: _.get(model, 'identifier', ''),
    },
    required: {
      value: _.get(model, 'required', ''),
    },
    'toggle-linkContentType': {
      value: !_.isEmpty(getLinkContentType(model)),
    },
    linkContentType: {
      value: getLinkContentType(model),
    },
    'validations-limit': {
      value: shouldCheckValidationRange(model),
    },
    'validations-limit-min': {
      value: getValidationRangeMin(model),
    },
    'validations-limit-max': {
      value: getValidationRangeMax(model),
    },
    'validations-match-pattern': {
      value: !_.isEmpty(getValidationPattern(model)),
    },
    'validations-pattern-template': {
      value: getValidationPattern(model),
    },
    'validations-pattern': {
      value: getValidationPattern(model),
    },
    'validations-pattern-flags': {
      value: 'ig',
    },
    'validations-show-options': {
      value: _.size(getValidationOptions(model)) > 0,
    },
    'validations-options': {
      value: getValidationOptions(model),
    },
    appearance: {
      value: _.get(model, 'appearance'),
    },
    helpText: {
      value: _.get(model, 'helpText'),
    },
  };
  return fields;
};


const shouldDisableTab = (fieldType) => {
  if (fieldType === 'Text' || fieldType === 'Link') return false;
  return true;
};


class FieldCreateForm extends Component {

  static propTypes = {
    visible: T.bool.isRequired,
    form: T.shape({
      getFieldDecorator: T.func,
      getFieldValue: T.func,
      setFieldsValue: T.func,
    }).isRequired,
    field: T.object.isRequired,
    onCancel: T.func.isRequired,
    onSubmit: T.func.isRequired,
    contentTypes: T.arrayOf(T.shape({ _id: T.string, name: T.string })),
  }

  static defaultProps = {
    contentTypes: [],
  }

  state = {
    showValidationRangeSection: false,
  }

  handleInputNameChange = (value) => {
    this.props.form.setFieldsValue({
      identifier: _.kebabCase(value),
    });
  }

  handleValidationPatternTemplateChange = (value) => {
    this.props.form.setFieldsValue({
      'validations-pattern': value,
    });
  }

  handleSubmit = () => {
    const { form, onSubmit } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const fieldValues = mapFieldsToProps(form.getFieldsValue());
        console.log('handleSubmit', values, fieldValues);
        onSubmit(fieldValues);
      }
    });
  }

  renderValidationFieldTypeText = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    return (
      <div>
        <Form.Item>
          {getFieldDecorator('required', { valuePropName: 'checked' })(<Switch />)}
          <span style={{ marginLeft: 15 }}>This is required field.</span>
        </Form.Item>
        <Row>
          <Col span="12">
            <Form.Item>
              {getFieldDecorator('validations-limit', {
                valuePropName: 'checked',
              })(<Switch />)}
              <span style={{ marginLeft: 15 }}>Limit Character Count</span>
            </Form.Item>
          </Col>
          {
            getFieldValue('validations-limit') &&
            <span>
              <Col span="4">
                <Form.Item>
                  {getFieldDecorator('validations-limit-min', {
                  })(<Input placeholder="Min" />)}
                </Form.Item>
              </Col>
              <Col span="1">
                <p className="ant-form-split">-</p>
              </Col>
              <Col span="4">
                <Form.Item>
                  {getFieldDecorator('validations-limit-max', {
                  })(<Input placeholder="Max" />)}
                </Form.Item>
              </Col>
            </span>
          }
        </Row>
        <Row>
          <Col span="12">
            <Form.Item>
              {getFieldDecorator('validations-match-pattern', {
                valuePropName: 'checked',
              })(<Switch />)}
              <span style={{ marginLeft: 15 }}>Match specific pattern</span>
            </Form.Item>
          </Col>
          {
            getFieldValue('validations-match-pattern') &&
            <span>
              <Col span="4">
                <Form.Item>
                  {getFieldDecorator('validations-pattern-template', {
                    initialValue: 'custom',
                    onChange: this.handleValidationPatternTemplateChange,
                  })(
                    <Select>
                      <Select.Option value="custom">Custom</Select.Option>
                      <Select.Option value={Pattern.email.toString()}>Email</Select.Option>
                      <Select.Option value={Pattern.url.toString()}>URL</Select.Option>
                    </Select>)}
                </Form.Item>
              </Col>
              <Col span="8">
                <Form.Item>
                  {getFieldDecorator('validations-pattern', {
                  })(<Input placeholder="Pattern..." />)}
                </Form.Item>
              </Col>
            </span>
          }
        </Row>
        <Row>
          <Col span="12">
            <Form.Item>
              {getFieldDecorator('validations-show-options', {
                valuePropName: 'checked',
              })(<Switch />)}
              <span style={{ marginLeft: 15 }}>Accept only specified value</span>
            </Form.Item>
          </Col>
          {
            getFieldValue('validations-show-options') &&
              <Col span="12">
                <Form.Item>
                  {getFieldDecorator('validations-options', {})(<EditableTagGroup />)}
                </Form.Item>
              </Col>
          }
        </Row>
      </div>
    );
  }

  renderValidationFieldTypeLink = () => {
    const { contentTypes } = this.props;
    const contentTypeOptions = _.map(contentTypes, ct => ({ value: ct._id, label: ct.name }));
    const { getFieldDecorator, getFieldValue } = this.props.form;

    return (
      <div>
        <Form.Item>
          {getFieldDecorator('required', { valuePropName: 'checked' })(<Switch />)}
          <span style={{ marginLeft: 15 }}>This is required field.</span>
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('toggle-linkContentType', { valuePropName: 'checked' })(<Switch />)}
          <span style={{ marginLeft: 15 }}>Accept only specified entry type</span>
        </Form.Item>
        {
          getFieldValue('toggle-linkContentType') &&
            <Form.Item>
              {getFieldDecorator('linkContentType', {})(<CheckboxGroup options={contentTypeOptions} />)}
            </Form.Item>
        }
      </div>
    );
  }

  renderValidation = (fieldType) => {
    switch (fieldType) {
      case 'Link':
        return this.renderValidationFieldTypeLink();
      case 'Text':
      default:
        return this.renderValidationFieldTypeText();
    }
  }

  renderAppearance = (fieldType) => {
    const { getFieldDecorator } = this.props.form;
    switch (fieldType) {
      case 'Text':
        return (
          <div>
            <Form.Item label="Choose how this field should be displayed">
              {getFieldDecorator('appearance', {
              })(
                <RadioGroup>
                  <RadioButton value="single-line">Single Line</RadioButton>
                  <RadioButton value="dropdown">Dropdown</RadioButton>
                  <RadioButton value="radio">Radio</RadioButton>
                </RadioGroup>)}
            </Form.Item>
            <Form.Item label="Help Text">
              {getFieldDecorator('helpText', {
              })(<Input placeholder="This help text will show up below the field" />)}
            </Form.Item>
          </div>
        );
      default:
        return (<div />);
    }
  }

  render() {
    const { visible, onCancel, form, field } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    // const fieldType = _.get(field, 'type', 'Text');
    const fieldType = _.head(getFieldValue('type'));
    const isNew = _.get(field, '_id') === undefined;
    return (
      <Modal
        visible={visible}
        title="Create a new Field"
        cancelText="Cancel"
        okText={isNew ? 'Create field' : 'Update field'}
        onCancel={onCancel}
        onOk={this.handleSubmit}
        width={800}
      >
        <Row>
          <Col span={8}>
            <Form.Item>
              {getFieldDecorator('type', {
                valuePropName: 'selectedKeys',
                initialValue: [fieldType],
                trigger: 'onSelect',
                getValueFromEvent: ({ selectedKeys }) => selectedKeys,
              })(
                <Menu mode="inline" style={{ width: 200 }}>
                  <Menu.Item key="Text"><Icon type="edit" /> Text</Menu.Item>
                  <Menu.Item key="LongText"><Icon type="file-text" /> LongText</Menu.Item>
                  <Menu.Item key="Number"><Icon type="calculator" />Number</Menu.Item>
                  <Menu.Item key="Datetime"><Icon type="calendar" /> Date and Time</Menu.Item>
                  <Menu.Item key="Location"><Icon type="environment" />Location</Menu.Item>
                  <Menu.Item key="Media"><Icon type="picture" /> Media</Menu.Item>
                  <Menu.Item key="Boolean"><Icon type="flag" />Boolean</Menu.Item>
                  <Menu.Item key="Object"><Icon type="database" />JSON Object</Menu.Item>
                  <Menu.Item key="Link"><Icon type="link" />Reference</Menu.Item>
                </Menu>)}
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form layout="vertical">
              <Tabs defaultActiveKey="settings">
                <TabPane tab="Settings" key="settings">
                  <Form.Item>
                    {getFieldDecorator('_id', {})(<Input type="hidden" />)}
                  </Form.Item>
                  <Form.Item label="Name">
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: 'Please input the name of collection!' }],
                      onChange: e => this.handleInputNameChange(e.target.value),
                    })(<Input placeholder="Product, Blog, Post, etc..." size="large" />)}
                  </Form.Item>
                  <Form.Item label="API Identifier">
                    {getFieldDecorator('identifier', {
                      rules: [{ required: true, message: 'required' }],
                    })(<Input size="large" />)}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('isDisplayField', {
                      valuePropName: 'checked',
                    })(<Checkbox>This field represent as title.</Checkbox>)}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('isMultiple', {
                      valuePropName: 'checked',
                    })(<Checkbox>This field has multiple items.</Checkbox>)}
                  </Form.Item>
                </TabPane>
                <TabPane tab="Validation" key="validation">
                  {this.renderValidation(fieldType)}
                </TabPane>
                <TabPane tab="Appearance" key="appearance" disabled={shouldDisableTab(fieldType)}>
                  {this.renderAppearance(fieldType)}
                </TabPane>
              </Tabs>
            </Form>
          </Col>
        </Row>
      </Modal>
    );
  }
}


export default Form.create({
  mapPropsToFields,
})(FieldCreateForm);
