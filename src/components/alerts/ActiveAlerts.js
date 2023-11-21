import React from 'react';
import "../../styles/home.css";
import SpinningLoader from "../Visuals/SpinningLoader";
import { auth } from "../../backend/firebase";
import { signOut } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { FiArrowRight, FiTrash } from "react-icons/fi";

class ActiveAlerts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: true, // Viewing active alerts
            search: '',
            deleteAlert: '',
        };
    }

    async componentDidMount() {
        const alerts = await httpsCallable(getFunctions(), 'getAlerts')();
        this.props.setAlerts(alerts.data);
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
        if (this.props.alerts.length === 0) {
            return <SpinningLoader loading={this.state.loading}/>;
        }

        // Shows option to delete an alert
        const deleteAlert = (item) => {
            // Completed alerts can't be deleted
            if (!item.active) {
                return;
            }

            // If the trash can was clicked, show a confirmation menu
            if (this.state.deleteAlert === item.id) {
                return (
                    <span className="current">
                        <text style={{ color: 'red' }}>Delete? </text>
                        <button style={{ color: 'red', borderRadius: '10px', background: 'white' }} onClick={() => this.props.deleteAlert(this.state.deleteAlert)}>
                            Yes
                        </button>
                        {" "}
                        <button style={{ color: 'black', borderRadius: '10px', background: 'white' }} onClick={this.closeDeleteAlertConfirm}>
                            No
                        </button>
                      </span>
                );
            }

            // Otherwise, show the trash can icon
            return (
                <span className="current">
                    <FiTrash cursor="pointer" onClick={() => this.deleteAlertConfirm(item.id)}/>
                </span>
            );
        }

        return <div className="alerts-container">
            {this.props.alerts.map((item, index) => item.active === isActive && item.ticker.includes(this.state.search) &&
                <div className="stock">
                    <div className="stock-row">
                        <span className="stock-name">{item.ticker}</span>
                        <span className="target">Target Price: {item.target}</span>
                    </div>
                    <div className="stock-row">
                        <span className="date">📅 {this.getDate(item.time)}</span>
                        {deleteAlert(item)}
                    </div>
                </div>)}
        </div>;
    }

    deleteAlertConfirm = (id) => {
        this.setState({ deleteAlert: id });
    }

    closeDeleteAlertConfirm = () => {
        this.setState({ deleteAlert: '' });
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

    handleSearch = (event) => {
        this.setState({ search: event.target.value.toUpperCase() });
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
                <input type="text" className="field" name="search" placeholder="Search..." style={{'text-transform': 'uppercase'}} onChange={this.handleSearch}/>
                {this.renderAlerts(this.state.active)}

                <br/>
                <h4>
                    {this.state.active ? "Completed Alerts" : "Active Alerts 🚨"} {"  "}
                    <FiArrowRight onClick={this.state.active ? this.toCompleted : this.toActive}/>
                </h4>
            </div>
        );
    }
}

export default ActiveAlerts;
