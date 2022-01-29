import React from 'react';
import { Navigate } from 'react-router';
import { signIn } from '../firebase.js'

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
        signIn(event.email, event.password)
        this.setState({loggedin: true})
        event.preventDefault();
    }
    
    render() {
        if (this.state.loggedin === true) {
            return <Navigate to='/profile' />
        }

        return (
            <div class="form">

            <div class="form-title">Log in</div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        email:
                        <input type="text" name="email" />
                    </label>
                    <label>
                        password:
                        <input type="text" name="password" />
                    </label>
                    <input type="submit" value="GO" />
                </form>
            </div>
        );
    }
  }

export default LoginForm;