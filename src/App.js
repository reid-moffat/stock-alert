import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import LoginSignup from './screens/LoginSignupScreen.js';
import Home from './screens/HomeScreen.js'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/stock-alert" element={<LoginSignup />}/>
        <Route path="/stock-alert/home" element={<Home />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
