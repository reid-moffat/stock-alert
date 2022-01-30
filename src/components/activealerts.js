import React from 'react';
import { getAlerts } from '../firebase.js'
import { Navigate } from 'react-router';

class ActiveAlerts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
    }

    async componentDidMount(){
        var test = await getAlerts(sessionStorage.getItem("uid"))
        console.log(test[0].test2)
        console.log(test[1].test2)
        for (var i = 0; i < test.length; i++) {
            this.setState({list: [...this.state.list, test[i]]})
        }
        console.log(this.state.list)
    }
    
    render() {
        return (
            <>
            {this.state.list.map((item, index) => (
                <div>
                    Stock: {item.stock}<br/>
                    Current Price: {item.current}<br/>
                    Target Price: {item.target}<br/>
                    Date Set: {item.date}<br/><br/>
                </div>
            ))}
        </>
        );
    }
  }

export default ActiveAlerts