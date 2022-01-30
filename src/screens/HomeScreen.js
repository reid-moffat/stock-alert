import React from 'react';
import ActiveAlerts from '../components/activealerts.js';
import NewAlert from '../components/newalert.js';
import Header from '../components/header.js';
import "./home.css";

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
        console.log(this.state.activealerts)
        if (this.state.activealerts) {
            return (
                <>
                    <Header/>
                    <div class="row">
                        <div class="navbar">
                            <div class="outline-button active" onClick={this.navAlerts}>Alerts</div>
                            <div class="outline-button" onClick={this.navNew}>New Alert</div>
                        </div>
                        <div class="content">
                            <ActiveAlerts/>
                        </div>
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <Header/>
                    <div class="row">
                        <div class="navbar">
                            <div class="outline-button" onClick={this.navAlerts}>Alerts</div>
                            <div class="outline-button active" onClick={this.navNew}>New Alert</div>
                        </div>
                        <div class="content">
                            <NewAlert/>
                        </div>
                    </div>
                </>
            )
        }
    }
}

export default Home;