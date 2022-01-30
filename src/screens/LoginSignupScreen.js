import React from 'react';

import LoginForm from '../components/loginform.js';
import SignupForm from '../components/signup.js';
import Header from '../components/header.js';

class LoginSignup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signup: false
        };

        this.toLogin = this.toLogin.bind(this);
        this.toSignup = this.toSignup.bind(this);
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
                <Header/>
                <div class="login-left">
                    <div class="login-title">Test</div>
                </div>
                <div class="login-right">
                    {this.state.signup ?
                        <>
                            <SignupForm/>
                            <button class="login-line-button" onClick={this.toLogin}>login</button>
                        </> :
                        <>
                            <LoginForm/>
                            <button class="login-line-button" onClick={this.toSignup}>signup</button>
                        </>
                    }
                </div>

            </>
        );
    }
}

export default LoginSignup;