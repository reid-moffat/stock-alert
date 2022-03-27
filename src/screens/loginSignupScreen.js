import React from 'react';

import LoginForm from '../components/loginForm.js';
import SignupForm from '../components/signup.js';
import Header from '../components/header.js';
import "../styles/loginSignup.css";

class LoginSignup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signup: false
        };

        this.toLogin = this.toLogin.bind(this);
        this.toSignup = this.toSignup.bind(this);
    }

    toLogin = () => {
        this.setState({signup: false});
    }

    toSignup = () => {
        this.setState({signup: true});
    }

    render() {
        return (
            <>
                <Header/>
                <div class="row">
                    <div class="login-left">
                        <div class="login-title">Get alerts on your stocks!</div>
                        <img
                            alt="Stock Alert logo" className="stock-img"
                            src="https://media.discordapp.net/attachments/833233857343782965/937336300728619088/stock_prices.png"
                        />

                    </div>
                    <div class="login-right">
                        {this.state.signup ?
                            <>
                                <SignupForm/>
                                Already have an account? <button class="login-line-button"
                                                                 onClick={this.toLogin}>Login</button>
                            </> :
                            <>
                                <LoginForm/>
                                Don't have an account? <button class="login-line-button" onClick={this.toSignup}>Sign
                                up</button>
                            </>
                        }
                    </div>
                </div>
            </>
        );
    }
}

export default LoginSignup;
