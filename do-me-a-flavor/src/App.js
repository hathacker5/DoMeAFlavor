import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home.js';
import Flavor from './pages/Flavor.js';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/DoMeAFlavor/" element={<Home />} />
        <Route path="/DoMeAFlavor/flavors" element={<Flavor />} />
      </Routes>
    </div>
  );
}

export default App;