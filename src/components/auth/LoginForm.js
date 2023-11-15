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
            <div class="form">

                <div class="form-title">Log in</div>
                <form onSubmit={this.handleSubmit}>
                    <label>Email</label><br/>
                    <input type="text" class="field" name="email"/>
                    <br/>
                    <label>Password</label><br/>
                    <input type="password" class="field" name="password"/>
                    <br/>
                    <input type="submit" class="form-btn btn" value="Login"/>
                </form>
            </div>
        );
    }
}

export default LoginForm;