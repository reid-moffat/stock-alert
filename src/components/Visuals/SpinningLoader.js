import React from "react";
import { Vortex } from "react-loader-spinner";

class SpinningLoader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <Vortex
            colors={['#eea76a', '#b84410', '#eea76a', '#b84410', '#b84410', '#eea76a']}
            width={50}
            height={50}
            visible={this.props.loading}
        />;
    }
}

export default SpinningLoader;
