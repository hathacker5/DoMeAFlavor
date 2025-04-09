import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import Flavor from "./pages/Flavor.js";
import Ingredients from "./pages/Ingredients.js";
import RecipeList from "./pages/RecipeList.js";
import RecipePage from "./pages/RecipePage.js";
import { useLocation } from "react-router-dom";
import { useState } from "react";

function App() {
  const [userIngredientList, setUserIngredientList] = useState([]);
  const [userExclusionList, setUserExclusionList] = useState([]);

  const initialFlavors = new Map([
    ["Spicy", 0],
    ["Sweet", 0],
    ["Salty", 0],
    ["Bitter", 0],
    ["Rich", 0],
    ["Umami", 0],
    ["Sour", 0],
  ]);
  const [userFlavorPreference, setUserFlavorPreference] =
    useState(initialFlavors);

  const [userRecipeList, setUserRecipeList] = useState([]);

  const [tutorialMode, setTutorialMode] = useState(false);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home tutorialMode={tutorialMode} setTutorialMode={setTutorialMode}/>} />

        <Route
          path="Ingredients"
          element={
            <Ingredients
              userIngredientList={userIngredientList}
              setUserIngredientList={setUserIngredientList}
            />
          }
        />

        <Route
          path="Flavors"
          element={
            <Flavor
              userFlavorPreference={userFlavorPreference}
              setUserFlavorPreference={setUserFlavorPreference}
            />
          }
        />

        <Route
          path="RecipeList"
          element={
            <RecipeList
              userIngredientList={userIngredientList}
              setUserIngredientList={setUserIngredientList}
              userExclusionList={userExclusionList}
              setUserExclusionList={setUserExclusionList}
              userFlavorPreference={userFlavorPreference}
              setUserFlavorPreference={setUserFlavorPreference}
              userRecipeList={userRecipeList}
              setUserRecipeList={setUserRecipeList}
              tutorialMode={tutorialMode}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
