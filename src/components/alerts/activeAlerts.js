import React from 'react';
import { getAlerts } from '../../backend/endpoints.js'
import "../../styles/home.css";
import { Vortex } from "react-loader-spinner";
import SpinningLoader from "../Visuals/SpinningLoader";

class ActiveAlerts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
    }

    async componentDidMount() {
        const test = await getAlerts();
        console.log('After results: ' + JSON.stringify(test, null, 4));
        for (let i = 0; i < test.length; i++) {
            this.setState({list: [...this.state.list, test[i]]})
        }
        console.log(this.state.list)
    }

    navNew = () => {
        this.setState({activealerts: false})
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

    render() {
        return (
            <div className="alert">
                <div class="stock-row">
                    <h2>Active Alerts 🚨</h2>
                </div>
                {this.renderAlerts(true)}

                <div className="stock-row">
                    <h2>Completed Alerts</h2>
                </div>
                {this.renderAlerts(false)}
            </div>
        );
    }
}

export default ActiveAlerts