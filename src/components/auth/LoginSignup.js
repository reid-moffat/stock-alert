import React from 'react';
import LoginForm from './LoginForm.js';
import SignupForm from './SignupForm.js';
import "../../styles/loginSignup.css";

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

    // Renders login/sign up form based on state
    renderAuthForm = () => {
        if (this.state.signup) {
            return (
                <>
                    <SignupForm/>
                    Already have an account? <button class="login-line-button" onClick={this.toLogin}>Login</button>
                </>
            );
        }

        return (
            <>
                <LoginForm/>
                Don't have an account? <button class="login-line-button" onClick={this.toSignup}>Sign up</button>
            </>
        );
    }

    render() {
        return (
            <>
                <div class="login-right">{this.renderAuthForm()}</div>
            </>
        );
    }
}

export default LoginSignup;
