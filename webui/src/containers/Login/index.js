import React, { Component } from 'react';

class Login extends Component {
  componentDidMount() {
    console.log('Login:componentDidMount', this.props);
    this.props.auth.login({
      container: 'auth0',
    });
  }

  render() {
    return (
      <div>
        <div id="auth0" />
      </div>
    )
  }
}

export default Login;
