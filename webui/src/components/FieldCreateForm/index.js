import React, { Component } from 'react';
import _ from 'lodash';

import { Modal, Form, Select, Checkbox, Input, Switch, Row, Col, Menu, Icon, Collapse, Radio } from 'antd';
import EditableTagGroup from '../../components/EditableTagGroup';
import Pattern from '../../helpers/regex-pattern';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const getValidationRangeMin = (model) => _.get(model, 'validations.range.min' ,'');
const getValidationRangeMax = (model) => _.get(model, 'validations.range.max' ,'');
const getValidationPattern = (model) => _.get(model, 'validations.regexp.pattern' ,'');
const getValidationOptions = (model) => _.get(model, 'validations.in', []);

const shouldCheckValidationRange = (model) => {
  const minValue = getValidationRangeMin(model);
  const maxValue = getValidationRangeMax(model);
  return minValue || maxValue;
}

const mapFieldsToProps = (fieldsValue) => {

  console.log("mapFieldsToProps -------------- ", fieldsValue.isMultiple);
  const type = _.head(fieldsValue.type);
  const typeObj = fieldsValue.isMultiple !== true ? { type: type } : { type:'Array', items:{ type: type } };
  return {
    ..._.pick(fieldsValue, ['_id', 'name', 'identifier', 'required', 'isDisplayField', 'isMultiple']),
    ...typeObj,
    validations: {
      linkContentType: '',
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
    }
  }
}

const mapPropsToFields = (props) => {

  const model = props.field;
  const fields = {
    _id: {
      value: _.get(model, '_id' ,''),
    },
    type: {
      value: [_.get(model, 'type') !== 'Array' ? _.get(model, 'type') : _.get(model, 'items.type')],
    },
    isDisplayField: {
      value: _.get(model, 'isDisplayField'),
    },
    isMultiple:{
      value: _.get(model, 'type') === 'Array',
    },
    name: {
      value: _.get(model, 'name' ,''),
    },
    identifier: {
      value: _.get(model, 'identifier' ,''),
    },
    required: {
      value: _.get(model, 'required' ,''),
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
    }
  };

  // console.log('mapPropsToFields:props', props);
  console.log('mapPropsToFields:fields', fields);
  return fields;
}


class FieldCreateForm extends Component {

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
        console.log('Received values of form: ', values);
        const fieldValues = mapFieldsToProps(form.getFieldsValue())
        onSubmit(fieldValues);
      }
    });

  }

  render() {
    const { visible, onCancel, form, fieldValues } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Modal
        visible={visible}
        title="Create a new Field"
        cancelText="Cancel"
        okText="Create"
        onCancel={onCancel}
        onOk={this.handleSubmit}
        width={800}
      >
        <Row>
          <Col span={8}>
            <Form.Item>
              {getFieldDecorator('type', {
                valuePropName: 'selectedKeys',
                initialValue:  [_.get(fieldValues, 'type', 'text')],
                trigger: 'onSelect',
                getValueFromEvent: ({ value, key, selectedKeys }) => {
                  // Convert onSelect({ value, key ,selectedKeys }) and send only selectedKeys to Form.Item
                  console.log('getValueFromEvent', value, key, selectedKeys);
                  return selectedKeys;
                },
              })(
                <Menu
                  mode="inline"
                  style={{ width: 200 }}
                >
                  <Menu.Item key="Text"><Icon type="edit" /> Text</Menu.Item>
                  <Menu.Item key="LongText"><Icon type="file-text" /> LongText</Menu.Item>
                  <Menu.Item key="Number"><Icon type="calculator" />Number</Menu.Item>
                  <Menu.Item key="Datetime"><Icon type="calendar" /> Date and Time</Menu.Item>
                  <Menu.Item key="Location"><Icon type="environment" />Location</Menu.Item>
                  <Menu.Item key="Media"><Icon type="picture" /> Media</Menu.Item>
                  <Menu.Item key="Boolean"><Icon type="flag" />Boolean</Menu.Item>
                  <Menu.Item key="Object"><Icon type="database" />JSON Object</Menu.Item>
                  <Menu.Item key="Link"><Icon type="link" />Reference</Menu.Item>
                </Menu>
              )}
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form layout="vertical">
              <Form.Item>
                {getFieldDecorator('_id', {})(
                  <Input type="hidden" />
                )}
              </Form.Item>
              <Form.Item label="Name">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Please input the name of collection!' }],
                  onChange: e => this.handleInputNameChange(e.target.value)
                })(
                  <Input placeholder="Product, Blog, Post, etc..." />
                )}
              </Form.Item>
              <Form.Item label="API Identifier">
                {getFieldDecorator('identifier', {
                  rules: [{ required: true, message: 'required' }],
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('isDisplayField', {
                  valuePropName: 'checked',
                })(
                  <Checkbox>This field represent as title.</Checkbox>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('isMultiple', {
                  valuePropName: 'checked',
                })(
                  <Checkbox>List.</Checkbox>
                )}
              </Form.Item>
              <Collapse>
                <Collapse.Panel header="Validation" key="1">
                  <Form.Item>
                    {getFieldDecorator('required', {
                      valuePropName: 'checked',
                    })(
                      <Switch />
                    )}
                    <span style={{ marginLeft: 15 }}>This is required field.</span>
                  </Form.Item>
                  <Row>
                    <Col span="12">
                      <Form.Item>
                        {getFieldDecorator('validations-limit', {
                          valuePropName: 'checked',
                          onChange: this.toggleRangeValidation,
                        })(
                          <Switch />
                        )}
                        <span style={{ marginLeft: 15 }}>Limit Character Count</span>
                      </Form.Item>
                    </Col>
                    {
                      getFieldValue('validations-limit') &&
                      <span>
                        <Col span="4">
                          <Form.Item>
                            {getFieldDecorator('validations-limit-min', {
                            })(
                              <Input placeholder="Min" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span="1">
                          <p className="ant-form-split">-</p>
                        </Col>
                        <Col span="4">
                          <Form.Item>
                            {getFieldDecorator('validations-limit-max', {
                            })(
                              <Input placeholder="Max" />
                            )}
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
                        })(
                          <Switch />
                        )}
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
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span="8">
                          <Form.Item>
                            {getFieldDecorator('validations-pattern', {
                            })(
                              <Input placeholder="Pattern..." />
                            )}
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
                        })(
                          <Switch />
                        )}
                        <span style={{ marginLeft: 15 }}>Accept only specified value</span>
                      </Form.Item>
                    </Col>
                    {
                      getFieldValue('validations-show-options') &&
                      <span>
                        <Col span="12">
                          <Form.Item>
                            {getFieldDecorator('validations-options', {

                            })(
                              <EditableTagGroup />
                            )}
                          </Form.Item>
                        </Col>
                      </span>
                    }
                  </Row>
                </Collapse.Panel>
                <Collapse.Panel header="Appearance" key="2">
                  <div>
                    <Form.Item>
                      {getFieldDecorator('appearance', {
                        initialValue: _.get(fieldValues, 'appearance') || 'single-line',
                      })(
                        <RadioGroup>
                          <RadioButton value="single-line">Single Line</RadioButton>
                          <RadioButton value="url">URL</RadioButton>
                          <RadioButton value="dropdown">Dropdown</RadioButton>
                          <RadioButton value="radio">Slug</RadioButton>
                        </RadioGroup>
                      )}
                    </Form.Item>
                  </div>
                </Collapse.Panel>
              </Collapse>

            </Form>
          </Col>
        </Row>
      </Modal>
    );
  }
}



export default Form.create({
  mapPropsToFields
})(FieldCreateForm);
