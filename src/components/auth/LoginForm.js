import React from 'react';
import { signIn } from '../../backend/endpoints.js'

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (event) => {
        // SUBMIT BUTTON EVENT HANDLER
        signIn(event.target.email.value, event.target.password.value)
            .then(() => {
                this.props.onLogin();
            })
        if (sessionStorage.getItem("uid") != null) {
            this.props.onLogin();
        }
        event.preventDefault();
    }

    render() {
        return (
            <>
                <div class="form" style={{ 'display': 'inline-block' }}>
                    <div class="form-title">Log in</div>
                    <form onSubmit={this.handleSubmit}>
                        <label>Email</label><br/>
                        <input type="text" class="field" name="email"/>
                        <br/>
                        <label style={{ 'float': 'left' }}>Password</label>
                        <span style={{ 'float': 'right' }}><button class={'forgot-password-button'} onClick={this.props.forgotPassword}>Forgot Password?</button></span>
                        <br/>
                        <input type="password" class="field" name="password"/>
                        <br/>
                        <input type="submit" class="form-btn btn" value="Login"/>
                    </form>
                </div>
                <br/>
                Don't have an account? <button class="login-line-button" onClick={this.props.toSignup}>Sign up</button>
            </>
        );
    }
}

export default LoginForm;