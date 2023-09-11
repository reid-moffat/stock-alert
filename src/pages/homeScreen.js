import React from 'react';
import ActiveAlerts from '../components/activeAlerts.js';
import NewAlert from '../components/newAlert.js';
import Header from '../components/header.js';
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
        const body = this.state.activealerts ? <ActiveAlerts/> : <NewAlert/>;
        return (
            <>
                <Header/>
                <div class="row">
                    <div class="navbar">
                        <div class={"outline-button" + this.state.activealerts ? " active" : ""} onClick={this.navAlerts}>Alerts</div>
                        <div class={"outline-button" + this.state.activealerts ? "" : " active"} onClick={this.navNew}>New Alert</div>
                    </div>
                    <div class="content">
                        {body}
                    </div>
                </div>
            </>
        )
    }
}

export default Home;