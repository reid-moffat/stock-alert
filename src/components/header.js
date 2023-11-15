import React from 'react';
import '../styles/header.css';

class Header extends React.Component {
    render() {
        return (
            <div className="header">
                <img
                    alt="Stock Alert logo" className="logo"
                    src={process.env.PUBLIC_URL + '/logo.png'}
                />
            </div>
        )
    }
}

export default Header