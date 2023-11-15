import React from 'react';
import NewAlert from '../components/alerts/newAlert.js';
import Header from '../components/header.js';
import LoginSignup from '../components/auth/LoginSignup.js';
import "../styles/home.css";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activealerts: true,
        };
    }

    navAlerts = () => {
        this.setState({ activealerts: true })
    }

    navNew = () => {
        this.setState({ activealerts: false })
    }

    render() {
        return (
            <>
                <Header/>
                <div class="row">
                    <div class="col">
                        <LoginSignup/>
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