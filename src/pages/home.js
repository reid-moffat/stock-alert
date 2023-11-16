import React from 'react';
import NewAlert from '../components/alerts/NewAlert.js';
import Header from '../components/header.js';
import LoginSignup from '../components/auth/LoginSignup.js';
import "../styles/home.css";
import ActiveAlerts from "../components/alerts/ActiveAlerts";
import { auth } from "../backend/firebase";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: auth.currentUser !== null,
        };
    }

    handleLogin = () => {
        this.setState({loggedIn: true});
    }

    handleSignOut = () => {
        this.setState({loggedIn: false});
    }

    render() {
        return (
            <>
                <Header/>
                <div class="row">
                    <div class="col">
                        {this.state.loggedIn ? <ActiveAlerts onLogout={this.handleSignOut}/> : <LoginSignup onLogin={this.handleLogin}/>}
                    </div>
                    <div class="col">
                        <NewAlert/>
                    </div>
                </div>

            </>
        )
    }
}

export default Home;
