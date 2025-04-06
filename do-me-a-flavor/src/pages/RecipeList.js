import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { useLocation } from 'react-router-dom';
import RecipePage from "./RecipePage";

function RecipeList(props) {
  const userIngredientList = props.userIngredientList;
  const setUserIngredientList = props.setUserIngredientList;
  const userFlavorPreference = props.userFlavorPreference;
  const setUserFlavorPreference = props.setUserFlavorPreference;
  const userRecipeList = props.userRecipeList;
  const setUserRecipeList = props.setUserRecipeList;

  const [recipePageButtonPopup, setRecipePageButtonPopup] = useState(false);
  
  return (
    <div>
      {/* RecipeListHeader todo */}
      <div className="container">
        {/* buttons */}
        <Link to="/Flavors">
          <button>Back</button>
        </Link> 
        <Link to="/">
          <button>Go Home</button>
        </Link>

        {console.log("userFlavorPreference", userFlavorPreference)}
        <button onClick={() => getRecipes(userIngredientList, setUserIngredientList, userFlavorPreference, setUserFlavorPreference, userRecipeList, setUserRecipeList)}>
          Get Recipes
        </button>

        {userRecipeList.map((recipe) => (
          <div>
            <RecipeCard recipe={recipe}/>

            <button onClick={() => setRecipePageButtonPopup(true)}> Open Recipe for {recipe.title}. </button>
            <RecipePage trigger={recipePageButtonPopup} setTrigger={setRecipePageButtonPopup} recipe={recipe} userIngredientList={userIngredientList} setUserIngredientList={setUserIngredientList}>
              Recipe for {recipe.title}  
            </RecipePage>
          </div>
        ))}
      </div>
    </div>
  );
}
const RecipeCard = ({ recipe }) => {
  return (
    <Col sm={12}>
      <Card
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          margin: "15px",
          marginBottom: "10px",
          borderRadius: "25px",
          borderWidth: "4px",
        }}
      >
        <Card.Body>
          <Card.Title style={{ fontSize: "32px", color: "#6cb1c9" }}>
            <b>{recipe.title}</b>
          </Card.Title>
          <Card.Text>
            <img src={recipe.image} alt={recipe.title} />
            <br/>
            {parseInt(recipe.score)}% flavor match
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

// returns a sorted list of recipes based on flavor profile match
const getRecipes = async (userIngredientList, setUserIngredientList, userFlavorPreference, setUserFlavorPreference, userRecipeList, setUserRecipeList) => {
  const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?ingredients=${userIngredientList}&number=10&ignorePantry=true&ranking=1`;
  const options = {
    method: "GET",  
    headers: {
      "x-rapidapi-key": "de53ce264cmshed6bd56bbc93472p1bddc7jsnd607dc0f88ca",
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    const recipeList = Object.entries(result).map(([index, value]) => value);
    for (var i = 0; i < recipeList.length; i++) {
      const recipe = recipeList[i];
      
      // await waits for the api call to return and for the function to give an actual result
      var flavors = await getFlavorProfile(recipe.id);

      if (flavors == []) {
        // api call didn't work
        recipeList[i].score = 0;
        console.log("api score won't work, getFlavorProfile failed");
      } else {
        // Calculates score
        var score = 0.0;
        score += 100 - Math.abs(flavors.bitterness - userFlavorPreference.get("Bitter"));
        score += 100 - Math.abs(flavors.fattiness - userFlavorPreference.get("Rich"));
        score += 100 - Math.abs(flavors.saltiness - userFlavorPreference.get("Salty"));
        score += 100 - Math.abs(flavors.sourness - userFlavorPreference.get("Sour"));
        const maxSpicy = 4500000;
        score += 100 - Math.abs((Math.min(flavors.spiciness, maxSpicy) / maxSpicy) * 100 - userFlavorPreference.get("Spicy"));
        score += 100 - Math.abs(flavors.sweetness - userFlavorPreference.get("Sweet"));
        score += 100 - Math.abs(flavors.savoriness - userFlavorPreference.get("Umami"));
        score /= 7;

        // Saves score to recipe json entry in recipeList
        recipeList[i].score = score;
      }
    }

    // sort list
    const sortedList = [...recipeList].sort((a, b) => b.score - a.score);
    
    setUserRecipeList(sortedList);
  } catch (error) {
    console.error(error);
  }
};

// fetches the flavor profile of an individual
const getFlavorProfile = async (recipeID) => {
  const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeID}/tasteWidget.json?normalize=false`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'de53ce264cmshed6bd56bbc93472p1bddc7jsnd607dc0f88ca',
      'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default RecipeList;