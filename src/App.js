import './styles/App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginSignup from './screens/loginSignupScreen.js';
import Home from './screens/homeScreen.js'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/stock-alert" element={<LoginSignup/>}/>
                <Route path="/stock-alert/home" element={<Home/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
