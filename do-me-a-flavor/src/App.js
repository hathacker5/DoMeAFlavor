import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import Flavor from "./pages/Flavor.js";
import Ingredients from "./pages/Ingredients.js";
import RecipeList from "./pages/RecipeList.js";


function App() {
  return (
    <div>
      <Routes>
        <Route path="Flavors" element={<Flavor />} />
        <Route path="/" element={<Home />} />
        <Route path="Ingredients" element={<Ingredients />} />
        <Route path="RecipeList" element={<RecipeList />} />
        {/* <Route path="/DoMeAFlavor/" element={<Home />} /> */}
      </Routes>
    </div>
  );
}

export default App;
