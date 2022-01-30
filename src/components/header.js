import React from 'react';
import './header.css';
//import { Navigate } from 'react-router';

class Header extends React.Component {
  render() {
    return(
      <div className="header">
        <img
          alt="Stock Alert logo" className="logo"
          src="https://media.discordapp.net/attachments/833233857343782965/937200024000028682/stockalert.png"
        />
      </div>
    )
  }
}

export default Header