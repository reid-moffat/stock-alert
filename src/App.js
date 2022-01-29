import stock from './stock.png';
import './App.css';
import {
  HashRouter as Router,
  Routes,
  Route
} from "react-router-dom";
// import LoginSignup from './screens/LoginSignupScreen.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={stock} className="App-logo" alt="logo" />
        <p>
          Stock alert is currently under construction
        </p>
        <a
          className="App-link"
          href="https://ca.finance.yahoo.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about stocks
        </a>
      </header>
    </div>
  );
}

export default App;
