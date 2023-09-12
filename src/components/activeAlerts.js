import React from 'react';
import {getAlerts} from '../backend/endpoints.js'
import "../styles/home.css";

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

    render() {
        return (
            <div className="alert">
                <div class="stock-row">
                    <h2>Active Alerts 🚨</h2>
                </div>

                <div class="alerts-container">
                    {this.state.list.map((item, index) => (item.active &&
                        <div class="stock">
                            <div class="stock-row">
                                <span class="stock-name">{item.ticker}</span>
                                <span class="target">Target Price: {item.target}</span>
                            </div>
                            <div class="stock-row">
                                <span class="date">📅 {item.date}</span>
                                {/*<span class="current">Current Price: {item.current}<br/></span>*/}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="stock-row">
                    <h2>Completed Alerts</h2>
                </div>

                <div className="alerts-container">
                    {this.state.list.map((item, index) => (!item.active &&
                        <div className="stock">
                            <div className="stock-row">
                                <span className="stock-name">{item.ticker}</span>
                                <span className="target">Target Price: {item.target}</span>
                            </div>
                            <div className="stock-row">
                                <span className="date">📅 {item.date}</span>
                                {/*<span class="current">Current Price: {item.current}<br/></span>*/}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default ActiveAlerts