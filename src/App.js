import './styles/App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/home.js'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/stock-alert/" element={<Home/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
