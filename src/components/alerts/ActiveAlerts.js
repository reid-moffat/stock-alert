import React from 'react';
import "../../styles/home.css";
import SpinningLoader from "../Visuals/SpinningLoader";
import { auth } from "../../backend/firebase";
import { signOut } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { FiArrowRight } from "react-icons/fi";

class ActiveAlerts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            active: true, // Viewing active alerts
        };
    }

    async componentDidMount() {
        const alerts = await httpsCallable(getFunctions(), 'getAlerts')();
        this.setState({ list: alerts.data })
    }

    navNew = () => {
        this.setState({ activealerts: false })
    }

    // Convert unix time (from firebase) to readable date
    getDate = (timestamp) => {
        const date = new Date(timestamp * 1000);

        const months = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"];

        const dayOrdinal = (day) => {
            if (day > 3 && day < 21) {
                return day + 'th';
            }

            switch (day % 10) {
                case 1:
                    return day + "st";
                case 2:
                    return day + "nd";
                case 3:
                    return day + "rd";
                default:
                    return day + "th";
            }
        };

        return months[date.getMonth()] + ' ' + dayOrdinal(date.getDate()) + ', ' + date.getFullYear();
    }

    renderAlerts = (isActive) => {
        if (this.state.list.length === 0) {
            return <SpinningLoader loading={this.state.loading}/>;
        }

        return <div className="alerts-container">
            {this.state.list.map((item, index) => item.active === isActive &&
                <div className="stock">
                    <div className="stock-row">
                        <span className="stock-name">{item.ticker}</span>
                        <span className="target">Target Price: {item.target}</span>
                    </div>
                    <div className="stock-row">
                        <span className="date">📅 {this.getDate(item.time)}</span>
                        {/*<span class="current">Current Price: {item.current}<br/></span>*/}
                    </div>
                </div>)}
        </div>;
    }

    logOut = () => {
        signOut(auth)
            .then(() => this.props.onLogout())
            .catch(() => {});
    }

    toActive = () => {
        this.setState({ active: true });
    }

    toCompleted = () => {
        this.setState({ active: false });
    }

    render() {
        return (
            <div className="alert">
                <h4>Signed in as 18rem8@queensu.ca</h4>
                <button class="form-btn btn" onClick={this.logOut}>Log out</button>
                <br/>

                <div class="stock-row">
                    <h2>{this.state.active ? "Active Alerts 🚨" : "Completed Alerts"}</h2>
                </div>
                {this.renderAlerts(this.state.active)}

                <br/>
                <div className="stock-row">
                    <h4>
                        {this.state.active ? "Completed Alerts" : "Active Alerts 🚨"} {"  "}
                        <FiArrowRight onClick={this.state.active ? this.toCompleted : this.toActive}/>
                    </h4>
                </div>
            </div>
        );
    }
}

export default ActiveAlerts