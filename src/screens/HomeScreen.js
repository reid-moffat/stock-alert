import React from 'react';
import ActiveAlerts from '../components/activealerts.js';
import NewAlert from '../components/newalert.js';

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

    render(){
        console.log(this.state.activealerts)
        if (this.state.activealerts) {
            return (
                <>
                    <div class="navbar">
                        <div class="outline-button" onClick={this.navAlerts}>Alerts</div>
                        <div class="outline-button" onClick={this.navNew}>New Alert</div>
                    </div>
                    <ActiveAlerts/>
                </>
            )
        }
        else{
            return (
                <>
                    <div class="navbar">
                        <div class="outline-button" onClick={this.navAlerts}>Alerts</div>
                        <div class="outline-button" onClick={this.navNew}>New Alert</div>
                    </div>
                    <NewAlert/>
                </>
            )
        }   
    }
}

export default Home;