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
                        <TabPane tab="Website" key="website">
                          <Row gutter={16}>
                            <Col span={12}>
                              <img src={`${process.env.PUBLIC_URL}/img/space-template-website.jpg`} alt="Template web" width="100%" />
                            </Col>
                            <Col span={12}>
                              <p style={{ lineHeight: 1.6 }}>Create Template for website, consists of static pages and posts.</p>
                            </Col>
                          </Row>
                        </TabPane>
                        <TabPane tab="Condo" key="condo">
                          <Row gutter={16}>
                            <Col span={12}>
                              <img src={`${process.env.PUBLIC_URL}/img/space-template-condo.jpg`} alt="Template Condo" width="100%" />
                            </Col>
                            <Col span={12}>
                              <p style={{ lineHeight: 1.6 }}>Template สำหรับทำอสังหาริมทรัพย์ ชนิดของ Unit, Unit ชั้นและตึก ฯลฯ.</p>
                            </Col>
                          </Row>
                        </TabPane>
                        <TabPane tab="Shopping Directory" key="directory">
                          <Row gutter={16}>
                            <Col span={12}>
                              <img src={`${process.env.PUBLIC_URL}/img/space-template-directory.jpg`} alt="Template Directory" width="100%" />
                            </Col>
                            <Col span={12}>
                              <p style={{ lineHeight: 1.6 }}>Template สำหรับโปรเจค Directory มี Unit, Floor, Category, etc.</p>
                            </Col>
                          </Row>
                        </TabPane>
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
