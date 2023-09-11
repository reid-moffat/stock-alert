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
            <>
                <div class="alert">
                    <div class="stock-row">
                        <h2>My Alerts 🚨</h2>

                    </div>

                    <div class="alerts-container">
                        {this.state.list.map((item, index) => (
                            <div class="stock">
                                <div class="stock-row">
                                    <span class="stock-name">{item.stock}</span>
                                    <span class="target">Target Price: {item.target}</span>
                                </div>
                                <div class="stock-row">
                                    <span class="date">📅 {item.date}</span>
                                    <span class="current">Current Price: {item.current}<br/></span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/*
                    <div class="alerts-container">
                        <div class="stock">
                            <div class="stock-row">
                                <span class="stock-name">AAPC</span>
                                <span class="target">test Target Price: 344</span>
                            </div>
                            <div class="stock-row">
                                <span class="date">📅 January 30, 2022</span>
                                <span class="current">test Current Price: 312</span>
                            </div>
                        </div>
                        <div class="stock">
                            <div class="stock-row">
                                <span class="stock-name">AAPC</span>
                                <span class="target">test Target Price: 344</span>
                            </div>
                            <div class="stock-row">
                                <span class="date">📅 January 30, 2022</span>
                                <span class="current">test Current Price: 312</span>
                            </div>
                        </div>
                    /div> 
                    */}
                </div>
            </>
        );
    }
}

export default ActiveAlerts