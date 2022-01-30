import React from 'react';
import {newAlert} from '../firebase.js';
import getPrice from "../finnhub";

class NewAlert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            stock: '',
            target: 0
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.stockChange = this.stockChange.bind(this);
        this.targetChange = this.targetChange.bind(this);
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        // SUBMIT BUTTON EVENT HANDLER
        console.log(this.state.stock)
        let price;
        try {
            price = await getPrice(this.state.stock);
        } catch (e) {
            console.log(e)
        }
        if (price <= 0) {
            console.log("error")
            return
        }
        console.log(price)
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        await newAlert(this.state.stock, price, this.state.target, today)

    }

    stockChange(event) {
        console.log(event.target.value)
        var temp = event.target.value
        this.setState({stock: temp})
    }

    targetChange(event) {
        this.setState({target: event.target.value})
    }

    render() {
        return (
            <>
                <input type="text" name="stock" onChange={this.stockChange}/>
                <input type="number" name="target" onChange={this.targetChange}/>
                <input type="submit" value="Add New Stock Alert!" onClick={this.handleSubmit}/>
            </>
        );
    }
}

export default NewAlert