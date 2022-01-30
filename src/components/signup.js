import React from 'react';
import {signUp} from '../firebase.js'
import {Navigate} from 'react-router';

class SignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (event) => {
        // SUBMIT BUTTON EVENT HANDLER
        signUp(event.target.email.value, event.target.password.value)
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

                <div class="form-title">Sign up</div>
                <form onSubmit={this.handleSubmit}>
                    <label>Email</label><br/>
                    <input type="text" class="field" name="email" onSubm/>
                    <br/>
                    <label>Password</label><br/>
                    <input type="password" class="field" name="password"/>
                    <br/>
                    <label>Confirm Password</label><br/>
                    <input type="password" class="field" name="cpassword"/>
                    <br/>
                    <input class="form-btn btn" type="submit" value="Sign Up"/>
                </form>
            </div>
        );
    }
}

export default SignupForm;