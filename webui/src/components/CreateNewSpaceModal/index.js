import React, { Component } from 'react';
import _ from 'lodash';

import { Modal, Form, Input, Radio, Row, Col, Select, Tabs } from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

class CreateNewSpaceModal extends Component {

  state = {
    createType: 'empty',
  }

  onChangeCreateType = (e) => {
    this.setState({
      createType: e.target.value,
    });
  }

  render() {

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    const { visible, onCancel, onSubmit, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Create a new space"
        okText="Create space"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={onSubmit}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Organization">
                {getFieldDecorator('organization', {
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Name">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Please input the name of space!' }],
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Locale">
                {getFieldDecorator('defaultLocale', {
                })(
                  <Select>
                    <Option value="en">English</Option>
                    <Option value="th">Thai</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <RadioGroup onChange={this.onChangeCreateType} value={this.state.createType}>
              <Radio style={radioStyle} value="empty">Create an empty space. I will fill it with my own content.</Radio>
              <Radio style={radioStyle} value="template">Create an example space. I would like to see how things work first.</Radio>
            </RadioGroup>
          </Row>
          {
            this.state.createType === 'template' &&
              <Row gutter={16}>
                <Form.Item>
                  {getFieldDecorator('template', {
                  })(
                    <Tabs defaultActiveKey="website">
                      <TabPane tab="Website" key="website">Content of Tab Pane 1</TabPane>
                      <TabPane tab="Condo" key="condo">Content of Tab Pane 2</TabPane>
                      <TabPane tab="Shopping Directory" key="directory">Content of Tab Pane 3</TabPane>
                    </Tabs>
                  )}
                </Form.Item>
              </Row>
          }
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(CreateNewSpaceModal);
