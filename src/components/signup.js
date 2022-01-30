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
                    <label>
                        email:
                        <input type="text" name="email" onSubm/>
                    </label>
                    <label>
                        password:
                        <input type="text" name="password"/>
                    </label>
                    <label>
                        confirm password:
                        <input type="text" name="cpassword"/>
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        );
    }
}

export default SignupForm;