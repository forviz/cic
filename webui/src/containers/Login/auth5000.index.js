import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Form, Input, Icon, Card, Checkbox, Button, Row, Col } from 'antd';
const FormItem = Form.Item;

import * as Actions from './actions';

const mapStateToProps = (state) => {
  return {}
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      loginUser: Actions.loginUser,
      loginWithGoogle: Actions.loginWithGoogle,
      loginWithFacebook: Actions.loginWithFacebook,
    }, dispatch),
  };
}

class Login extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    const { loginUser } = this.props.actions;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        loginUser({ email: values.email, password: values.password });
      }
    });
  }

  render() {
    const {
      loginWithGoogle,
      loginWithFacebook,
    } = this.props.actions;
    
    const { auth } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{ padding: 80 }}>
        <Button type="primary" onClick={auth.login.bind(this)}>Login</Button>
        <Row type="flex" justify="center">
          <Col span={12}>
            <Card title="Login">
              <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                  {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'Please input your username!' }],
                  })(
                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Email" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                  )}
                </FormItem>
                <FormItem>
                  <Row type="flex" justify="space-between">
                    <Col span={12}>
                      {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                      })(
                        <Checkbox>Remember me</Checkbox>
                      )}
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <a className="login-form-forgot" href="">Forgot password</a>
                    </Col>
                  </Row>
                  <Button type="primary" size="large" htmlType="submit" className="login-form-button" style={{ display: 'block', width: '100%' }}>
                    Log in
                  </Button>
                  <div style={{ textAlign: 'center' }}>
                    Or <a href="">register now!</a>
                  </div>
                </FormItem>
              </Form>
              <Row>
                <Button type="default" style={{ display: 'block', width: '100%' }} onClick={loginWithGoogle}>Login with Google</Button>
              </Row>
              <Row>
                <Button type="default" style={{ display: 'block', width: '100%' }} onClick={loginWithFacebook}>Login with Facebook</Button>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

const WrappedLoginForm = Form.create()(Login);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedLoginForm);
