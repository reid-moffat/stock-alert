import React from 'react';
import { forgotPassword, signIn } from "../../backend/endpoints";

class ForgotPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (event) => {
        forgotPassword(event.target.email.value)
            .then(() => {})
            .catch(() => {});

        event.preventDefault();
    }

    render() {
        return (
            <div class="form" style={{ 'display': 'inline-block' }}>
                <div class="form-title">Reset password</div>
                <form onSubmit={this.handleSubmit}>
                    <label>Email</label><br/>
                    <input type="text" class="field" name="email"/>
                    <br/>
                    <input type="submit" class="form-btn btn" value="Send link"/>
                </form>
            </div>
        );
    }
}

export default ForgotPassword;
