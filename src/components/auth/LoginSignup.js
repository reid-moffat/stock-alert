import React from 'react';
import LoginForm from './LoginForm.js';
import SignupForm from './SignupForm.js';
import "../../styles/loginSignup.css";

class LoginSignup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currState: this.states.LogIn,
        };

        this.toLogin = this.toLogin.bind(this);
        this.toSignup = this.toSignup.bind(this);
    }

    // All states this form can be in
    states = Object.freeze({
        LogIn: 0,
        SignUp: 1,
        ForgotPassword: 2,
    });

    toLogin = () => {
        this.setState({ currState: this.states.LogIn });
    }

    toSignup = () => {
        this.setState({ currState: this.states.SignUp });
    }

    toPasswordReset = () => {
        this.setState({ currState: this.states.ForgotPassword });
    }

    handleLogin = () => {
        this.props.onLogin();
    }

    // Renders login/sign up form based on state
    renderAuthForm = () => {
        switch (this.state.currState) {
            case this.states.LogIn:
                return (
                    <>
                        <LoginForm onLogin={this.handleLogin} forgotPassword={this.forgotPassword}/>
                        <br/>
                        Don't have an account? <button class="login-line-button" onClick={this.toSignup}>Sign up</button>
                    </>
                );
            case this.states.SignUp:
                return (
                    <>
                        <SignupForm onLogin={this.handleLogin}/>
                        Already have an account? <button class="login-line-button" onClick={this.toLogin}>Login</button>
                    </>
                );
            case this.states.ForgotPassword:
                break;
            default:
                throw new Error("Invalid LoginSignup page state: " + this.state.currState);
        }
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
