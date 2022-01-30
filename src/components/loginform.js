import React from 'react';
import {signIn} from '../firebase.js'
import {Navigate} from 'react-router';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (event) => {
        // SUBMIT BUTTON EVENT HANDLER
        signIn(event.target.email.value, event.target.password.value)
        if (sessionStorage.getItem("uid") != null) {
            this.setState({loggedin: true})
        }
        event.preventDefault();
    }

    render() {
        if (this.state.loggedin === true) {
            return <Navigate to='/stock-alert/home'/>
        }

        return (
            <div class="form">

                <div class="form-title">Log in</div>
                <form onSubmit={this.handleSubmit}>
                    <label class="input">
                        Email
                        <input type="text" name="email"/>
                    </label>
                    <label class="input">
                        Password
                        <input type="text" name="password"/>
                    </label>
                    <input type="submit" value="GO"/>
                </form>
            </div>
        );
    }
}

export default LoginForm;