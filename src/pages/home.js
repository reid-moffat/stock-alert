import React from 'react';
import NewAlert from '../components/alerts/newAlert.js';
import Header from '../components/header.js';
import LoginSignup from '../components/auth/LoginSignup.js';
import "../styles/home.css";
import ActiveAlerts from "../components/alerts/activeAlerts";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
        };
    }

    handleLogin = () => {
        this.setState({loggedIn: true});
    }

    render() {
        return (
            <>
                <Header/>
                <div class="row">
                    <div class="col">
                        {this.state.loggedIn ? <ActiveAlerts/> : <LoginSignup onLogin={this.handleLogin}/>}
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