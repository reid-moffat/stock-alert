import React from 'react';

import LoginForm from '../components/loginform';
import SignupForm from '../components/signup';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signup: false
        };
    }

    toLogin = () => {
        this.setState({signup: false});
    }

    toSignup = () => {
        this.setState({signup: true});
    }

    render() {
      return (
        <>
        <div class="login-left">
            <div class="login-title">Test</div>
        </div>
        <div class="login-right">
            {this.state.signup ? 
                <>
                    <SignupForm />
                    <button class="login-line-button" onClick={this.toLogin}>login</button>
                </>:
                <>
                    <LoginForm />
                    <button class="login-line-button" onClick={this.toSignup}>signup</button>
                </>
            }
        </div>

        </>
      );
    }
  }

export default Login;