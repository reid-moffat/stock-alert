import React from 'react';
import ActiveAlerts from '../components/activeAlerts.js';
import NewAlert from '../components/newAlert.js';
import Header from '../components/header.js';
import LoginSignup from './auth.js';
import "../styles/home.css";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activealerts: true
        };
    }

    navAlerts = () => {
        this.setState({activealerts: true})
    }

    navNew = () => {
        this.setState({activealerts: false})
    }

    render() {
        //const inactive = "outline-button";
        //const active = inactive + " active";
        //const body = this.state.activealerts ? <ActiveAlerts/> : <NewAlert/>;

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