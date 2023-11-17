import React from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../backend/firebase";
import SpinningLoader from "../Visuals/SpinningLoader";

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            message: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        if (event.target.email.value) {
            ;
        }
        if (!event.target.password.value) {
            this.setState({ message: 'Please enter a password' });
            return;
        }
        if (event.target.password.value.length < 6) {
            ;
        }

        await this.setState({ loading: true });
        signInWithEmailAndPassword(auth, event.target.email.value, event.target.password.value)
            .then(() => this.props.onLogin())
            .catch(async (err) => {
                console.log(`Error code: ${err.code} Message: ${err.message} All: ${JSON.stringify(err, null, 4)}`);
                await this.setState({ loading: false });
            });
    }

    renderMessage = () => {
        if (!this.state.message) return <></>;
        return <><br/><br/><text style={{ 'color': 'red' }}>{this.state.message}</text></>;
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
                        <span style={{ 'float': 'right' }}>
                            <button class={'forgot-password-button'} onClick={this.props.forgotPassword}>
                                Forgot Password?
                            </button>
                        </span>
                        <br/>
                        <input type="password" class="field" name="password" pattern="^.{6,}$" title="Please enter a valid password (6+ characters)" required/>
                        <br/>
                        <input type="submit" class="form-btn btn" value="Login"/>
                        <SpinningLoader loading={this.state.loading}/>
                        {this.renderMessage()}
                    </form>
                </div>
                <br/>
                <text>
                    Don't have an account? <button class="login-line-button" onClick={this.props.toSignup}>Sign up</button>
                </text>
            </>
        );
    }
}

export default LoginForm;