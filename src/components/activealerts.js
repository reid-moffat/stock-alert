import React from 'react';
import {getAlerts} from '../firebase.js'
import "../screens/home.css";

class ActiveAlerts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
    }

    async componentDidMount() {
        const test = await getAlerts(sessionStorage.getItem("uid"));
        console.log(test[0].test2)
        console.log(test[1].test2)
        for (let i = 0; i < test.length; i++) {
            this.setState({list: [...this.state.list, test[i]]})
        }
        console.log(this.state.list)
    }

    render() {
        return (
            <>  
                <div class="alert">
                <h2>My Alerts 🚨</h2>
                    {this.state.list.map((item, index) => (
                        <div>
                            Stock: {item.stock}<br/>
                            Current Price: {item.current}<br/>
                            Target Price: {item.target}<br/>
                            Date Set: {item.date}<br/><br/>
                        </div>
                    ))}
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
                    </div>
                </div>
            </>
        );
    }
}

export default ActiveAlerts