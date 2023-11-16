import React from 'react';
import { getFunctions, httpsCallable } from "firebase/functions";

class SignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (event) => {
        httpsCallable(getFunctions(), 'createAccount')({ email: event.target.email.value, password: event.target.password.value })
            .then()
            .catch((err) => {
                console.log(`Error: ${err}`);
            });
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
                <text>
                    Already have an account? <button class="login-line-button" onClick={this.props.toLogin}>Login</button>
                </text>
            </>
        );
    }
}

export default SignupForm;
