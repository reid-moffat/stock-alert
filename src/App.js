import stock from './stock.png';
import Login from './screens/loginsignup';
import './App.css';
import {
  HashRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
        <Routes>
            <Route exact path="/">
              <Login />
            </Route>
          </Routes>
      </Router>
  );
}

export default App;
