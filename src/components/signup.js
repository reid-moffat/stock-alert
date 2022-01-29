import React from 'react';
import { Navigate } from 'react-router';
import { signUp } from '../firebase.js'

class SignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        // SUBMIT BUTTON EVENT HANDLER
        signUp(event.email, event.password)
        this.setState({loggedin: true})
        event.preventDefault();
    }

    
      render() {
        if (this.state.loggedin === true) {
           
        }

        return (
            <div class="form">
                
            <div class="form-title">Sign up</div>
            <form onSubmit={this.handleSubmit}>
                <label>
                    email:
                    <input type="text" name="email" />
                </label>
                <label>
                    password:
                    <input type="text" name="password" />
                </label>
                <label>
                    confirm password:
                    <input type="text" name="cpassword" />
                </label>
                <input type="submit" value="Submit" />
            </form>
            </div>
        );
      }
  }

export default SignupForm;