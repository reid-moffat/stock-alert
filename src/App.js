import stock from './stock.png';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import LoginSignup from './screens/LoginSignupScreen.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/stock-alert" element={<LoginSignup />}>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
