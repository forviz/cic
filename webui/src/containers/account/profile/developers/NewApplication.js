import React, { Component } from 'react';
import { Form, Input, Checkbox, Button } from 'antd';

const FormItem = Form.Item;

class NewApplication extends Component {
  state = {
    name: '',
    description: '',
    redirectURL: '',
    read: false,
    write: false,
  };

  handleSubmit = (e) => {
    const { name, description, redirectURL, read, write } = this.state;
    e.preventDefault();

    fetch('http://localhost:4000/v1/application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        description: description,
        redirectURL: redirectURL,
        read: read,
        write: write,
      }),
    })
    .then(response => response.json())
    .then((response) => {
      console.log('your response here', response);
    }).catch((e) => {
      console.log('error', e);
    });

    window.location = 'http://localhost:3000/account/profile/developers/applications';
  }

  handleChange = (key, value) => {
    this.setState({
      [key]: value,
    });
  }

  render() {
    return (

      <Form onSubmit={this.handleSubmit} >
        <FormItem
          label="Name"
          hasFeedback
          required
        >
          <Input onChange={(e) => this.handleChange('name', e.target.value)} />
        </FormItem>
        <FormItem
          label="Description"
          hasFeedback
        >
          <Input onChange={(e) => this.handleChange('description', e.target.value)} />
        </FormItem>
        <FormItem
          label="Redirect URI"
          hasFeedback
        >
          <Input onChange={(e) => this.handleChange('redirectURL', e.target.value)} />
        </FormItem>

        <Checkbox onChange={(e) => this.handleChange('read', e.target.checked)}>Content management read</Checkbox>

        <Checkbox onChange={(e) => this.handleChange('write', e.target.checked)}>Content management manage</Checkbox>

        <Button type="primary" htmlType="submit" className="login-form-button">
          Create Application
        </Button>
      </Form>
    );
  }
}

export default NewApplication;
