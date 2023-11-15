import React from 'react';
import { signUp } from '../../backend/endpoints.js'

class SignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (event) => {
        // SUBMIT BUTTON EVENT HANDLER
        signUp(event.target.email.value, event.target.password.value)
        if (sessionStorage.getItem("uid") != null) {
            this.props.onLogin();
        }
        event.preventDefault();
    }

    render() {
        return (
            <>
                <div className="form">
                    <div className="form-title">Sign up</div>
                    <form onSubmit={this.handleSubmit}>
                        <label>Email</label><br/>
                        <input type="text" className="field" name="email"/>
                        <br/>
                        <label>Password</label><br/>
                        <input type="password" className="field" name="password"/>
                        <br/>
                        <label>Confirm Password</label><br/>
                        <input type="password" className="field" name="cpassword"/>
                        <br/>
                        <input className="form-btn btn" type="submit" value="Sign Up"/>
                    </form>
                </div>
                Already have an account? <button class="login-line-button" onClick={this.props.toLogin}>Login</button>
            </>
        );
    }
}

export default SignupForm;
