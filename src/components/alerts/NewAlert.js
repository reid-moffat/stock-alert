import React from 'react';
import "../../styles/custom.scss";
import "../../styles/home.css";
import { getFunctions, httpsCallable } from "firebase/functions";

class NewAlert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            email: '',
            stock: '',
            target: 0,
            errorMessage: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.stockChange = this.stockChange.bind(this);
        this.targetChange = this.targetChange.bind(this);
    }

    handleSubmit = async (event) => {
        httpsCallable(getFunctions(), 'addAlert')({email: this.state.email, ticker: this.state.stock, target: this.state.target})
            .then(() => {})
            .catch((err) => this.setState({errorMessage: err.message}));

        event.preventDefault();
    }

    // Skips all non-letters for stock input
    stockTickerInput(event) {
        if (!event.key.match(/[a-z]/i)) {
            event.preventDefault();
        }
    }

    emailChange(event) {
        this.setState({ email: event.target.value });
    }

    // Updates stock ticker value (ignores non-letters)
    stockChange(event) {
        const value = event.target.value;
        this.setState({stock: value.replace(/[^a-z]/gi, '').toUpperCase()});
    }

    targetChange(event) {
        this.setState({target: event.target.value});
    }

    render() {
        return (
            <div class="new-alert">
                <h1>New Alert</h1>
                {!this.props.loggedIn && <label>Email</label>}
                {!this.props.loggedIn && <input type="email" name="email" class="field" onChange={(e) => this.emailChange(e)}/>}
                <label>Stock Name</label>
                <input type="text" name="stock" class="field" style={{'text-transform': 'uppercase'}}
                       onKeyDown={(e) => this.stockTickerInput(e)} onChange={(e) => this.stockChange(e)}/>
                <label> Alert Price </label>
                <input type="number" name="target" class="field" onChange={this.targetChange}/>

                {this.state.errorMessage && <h3 style={{color: 'red'}}>{this.state.errorMessage}</h3>}
                <input type="submit" class="add-btn btn" value="Add Alert" onClick={this.handleSubmit}/>
            </div>
        );
    }
}

export default NewAlert