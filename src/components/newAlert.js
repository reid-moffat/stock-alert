import React from 'react';
import { addAlert } from '../backend/endpoints.js';
import "../styles/home.css";

class NewAlert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            stock: '',
            target: 0,
            errorMessage: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.stockChange = this.stockChange.bind(this);
        this.targetChange = this.targetChange.bind(this);
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        // SUBMIT BUTTON EVENT HANDLER
        console.log(this.state.stock)

        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        const result = await addAlert({ticker: this.state.stock, target: this.state.target})
            .catch((err) => this.setState({ errorMessage: err.message }));
        console.log("Add alert result: " + JSON.stringify(result, null, 4));
    }

    // Skips all non-letters for stock input
    stockTickerInput(event) {
        if (!event.key.match(/[a-z]/i)) {
            event.preventDefault();
        }
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
            <>
                <div class="new-alert">
                    <h1>New Alert</h1>
                    <label>Stock Name</label>
                    <input type="text" name="stock" class="field" style={{ 'text-transform': 'uppercase' }}
                           onKeyDown={(e) => this.stockTickerInput(e)} onChange={(e) => this.stockChange(e)}/>
                    <label> Alert Price </label>
                    <input type="number" name="target" class="field" onChange={this.targetChange}/>
                    {this.state.errorMessage && <h3 style={{ color: 'red' }}>{this.state.errorMessage}</h3>}
                    <input type="submit" class="add-btn btn" value="Add Alert" onClick={this.handleSubmit}/>
                </div>
            </>
        );
    }
}

export default NewAlert