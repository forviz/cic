import React, { Component } from 'react';
import _ from 'lodash';

import { Modal, Form, Select, Input, Checkbox, Row, Col, Menu, Icon, Collapse, Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class FieldCreateForm extends Component {

  handleInputNameChange = (value) => {
    this.props.form.setFieldsValue({
      identifier: _.kebabCase(value),
    });
  }

  render() {
    const { visible, onCancel, onCreate, form, fieldValues } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Create a new collection"
        cancelText="Cancel"
        okText="Create"
        onCancel={onCancel}
        onOk={onCreate}
        width={800}
      >
      <Row>
        <Col span={8}>
          <Form.Item>
            {getFieldDecorator('fieldType', {
              valuePropName: 'selectedKeys',
              initialValue:  [_.get(fieldValues, 'fieldType', 'text')],
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
                <Menu.Item key="text"><Icon type="edit" /> Text</Menu.Item>
                <Menu.Item key="number"><Icon type="calculator" />Number</Menu.Item>
                <Menu.Item key="datetime"><Icon type="calendar" /> Date and Time</Menu.Item>
                <Menu.Item key="location"><Icon type="environment" />Location</Menu.Item>
                <Menu.Item key="media"><Icon type="picture" /> Media</Menu.Item>
                <Menu.Item key="boolean"><Icon type="flag" />Boolean</Menu.Item>
                <Menu.Item key="object"><Icon type="database" />JSON Object</Menu.Item>
                <Menu.Item key="link"><Icon type="link" />Reference</Menu.Item>
              </Menu>
            )}
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form layout="vertical">
            <Form.Item>
              {getFieldDecorator('_id', {
                initialValue: _.get(fieldValues, '_id', ''),
              })(
                <Input type="hidden" />
              )}
            </Form.Item>
            <Form.Item label="Name">
              {getFieldDecorator('name', {
                initialValue: _.get(fieldValues, 'name', ''),
                rules: [{ required: true, message: 'Please input the name of collection!' }],
                onChange: e => this.handleInputNameChange(e.target.value)
              })(
                <Input placeholder="Product, Blog, Post, etc..." />
              )}
            </Form.Item>
            <Form.Item label="API Identifier">
              {getFieldDecorator('identifier', {
                initialValue: _.get(fieldValues, 'identifier', ''),
                rules: [{ required: true, message: 'required' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Collapse defaultActiveKey="1">
              <Collapse.Panel header="Validation" key="1">
                <Form.Item>
                  {getFieldDecorator('required', {
                    value: _.get(fieldValues, 'required', false),
                  })(
                    <Input />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('validations-limit', {
                    initialValue: _.get(fieldValues, 'validations-limit', ''),
                  })(
                    <Checkbox>Limit Character Count</Checkbox>
                  )}
                </Form.Item>
                <Row>
                  <Col span={8}>
                    <Form.Item>
                      {getFieldDecorator('validations-limit-condition', {
                        initialValue: _.get(fieldValues, 'validations-limit-condition', 'between'),
                      })(
                        <Select>
                          <Option value="between">Between</Option>
                          <Option value="atleast">At Least</Option>
                          <Option value="under">Not more than</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      {getFieldDecorator('validations-limit-min', {
                        initialValue: _.get(fieldValues, 'validations-limit-min', ''),
                      })(
                        <Input placeholder="Min" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      {getFieldDecorator('validations-limit-max', {
                        initialValue: _.get(fieldValues, 'validations-limit-max', ''),
                      })(
                        <Input placeholder="Max" />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <div>
                  <Form.Item>
                    {getFieldDecorator('validations-match-pattern', {
                      initialValue: _.get(fieldValues, 'validations-match-pattern', ''),
                    })(
                      <Checkbox>Match specific pattern</Checkbox>
                    )}
                  </Form.Item>
                </div>
                <div>
                  <Form.Item>
                    {getFieldDecorator('validations-options', {
                      initialValue: _.get(fieldValues, 'validations-options', ''),
                    })(
                      <Checkbox>Accept only specified value</Checkbox>
                    )}
                  </Form.Item>
                </div>
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

export default Form.create()(FieldCreateForm);
