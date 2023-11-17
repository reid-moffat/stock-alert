import React from 'react';
import NewAlert from '../components/alerts/NewAlert.js';
import Header from '../components/header.js';
import LoginSignup from '../components/auth/LoginSignup.js';
import "../styles/home.css";
import ActiveAlerts from "../components/alerts/ActiveAlerts";
import { auth } from "../backend/firebase";
import { getFunctions, httpsCallable } from "firebase/functions";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: auth.currentUser !== null,
            alerts: [],
        };
    }

    handleLogin = () => {
        this.setState({loggedIn: true});
    }

    handleSignOut = () => {
        this.setState({loggedIn: false});
    }

    addAlert = (alert) => {
        this.setState({ alerts: [...this.state.alerts, alert] });
    }

    setAlerts = (allAlerts) => {
        this.setState({ alerts: allAlerts });
    }

    deleteAlert = (alertId) => {
        httpsCallable(getFunctions(), 'deleteAlert')({ alertId: alertId })
            .then(() => {
                console.log(`Successfully deleted alert ${alertId}`);
                this.setState({ list: this.state.alerts.filter(e => e.id !== this.state.alertId), deleteAlert: '' });
            })
            .catch((err) => console.log(`Error deleting alert: ${err}`));
    }

    render() {
        return (
            <>
                <Header/>
                <div class="row">
                    <div class="col">
                        {this.state.loggedIn
                            ? <ActiveAlerts
                                onLogout={this.handleSignOut}
                                setAlerts={this.setAlerts}
                                deleteAlert={this.state.deleteAlert}
                                alerts={this.state.alerts}
                            />
                            : <LoginSignup onLogin={this.handleLogin}/>
                        }
                    </div>
                    <div class="col">
                        <NewAlert loggedIn={this.state.loggedIn} addAlert={this.state.addAlert}/>
                    </div>
                </div>

            </>
        )
    }
}

export default Home;
