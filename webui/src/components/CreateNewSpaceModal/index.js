import React, { Component } from 'react';
import _ from 'lodash';

import { Modal, Form, Input, Radio, Row, Col, Select, Tabs, Card } from 'antd';
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
            <Col span={14}>
              <Form.Item label="Name">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Please input the name of space!' }],
                })(
                  <Input placeholder="Project Name, client name, Store name, etc." />
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="Locale">
                {getFieldDecorator('defaultLocale', {
                  initialValue: 'en',
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
          <p>&nbsp;</p>
          {
            this.state.createType === 'template' &&
              <Card>
                <Row gutter={16}>
                  <Form.Item>
                    {getFieldDecorator('template', {
                      initialValue: 'website',
                    })(
                      <Tabs defaultActiveKey="website">
                        <TabPane tab="Website" key="website">Create Template for website, consists of static pages and posts.</TabPane>
                        <TabPane tab="Condo" key="condo">
                          <p>A template for condo Project</p>
                          <ul>
                            <li>Floor</li>
                            <li>Unit Type</li>
                            <li>Unit</li>
                            <li>Gallery</li>
                          </ul>
                        </TabPane>
                        <TabPane tab="Shopping Directory" key="directory">Content of Tab Pane 3</TabPane>
                      </Tabs>
                    )}
                  </Form.Item>
                </Row>
              </Card>
          }
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(CreateNewSpaceModal);
