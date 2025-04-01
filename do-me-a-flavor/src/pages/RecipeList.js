import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { useLocation } from 'react-router-dom';

function RecipeList() {
    const [recipeList, setRecipeList] = useState([]);
    
    // getting data from Flavor: ingredient list and flavor settings
    const location = useLocation();
    const {ingredientList, spicy, sweet, salty, bitter, rich, umami, sour} = location.state || {ingredientList: [], spicy: 0, sweet: 0, salty: 0, bitter: 0, rich: 0, umami: 0, sour: 0};

  return (
    <div className="container">
      <button>
        {" "}
        <Link to="/Flavors">Back</Link>{" "}
      </button>
      <button onClick={() => getRecipes(ingredientList, setRecipeList, spicy.spicy, sweet.sweet, salty.salty, bitter.bitter, rich.rich, umami.umami, sour.sour)}>
        Get Recipes
      </button>

      {recipeList.map((recipe) => (
        <RecipeCard recipe={recipe} />
      ))}
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
const getRecipes = async (ingredientList, setRecipeList, spicy, sweet, salty, bitter, rich, umami, sour) => {
  const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?ingredients=${ingredientList.ingredientList.ingredientList}&number=10&ignorePantry=true&ranking=1`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "5e280eff54msh125ec8c51385101p131466jsne19c66db25b6",
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    const recipeList = Object.entries(result).map(([index, value]) => value);
    for (var i = 0; i < recipeList.length; i++) {
      const recipe = recipeList[i];
      
      // await waits for the api call to return and for the function to give an actual
      // result
      var flavors = await getFlavorProfile(recipe.id);

      if (flavors == []) {
        // api call didn't work
        recipeList[i].score = 0;
        console.log("api score won't work, getFlavorProfile failed");
      } else {
        // Calculates score
        var score = 0.0;
        score += 100 - Math.abs(flavors.bitterness - bitter);
        score += 100 - Math.abs(flavors.fattiness - rich);
        score += 100 - Math.abs(flavors.saltiness - salty);
        score += 100 - Math.abs(flavors.sourness - sour);
        const maxSpicy = 4500000;
        score += 100 - Math.abs((Math.min(flavors.spiciness, maxSpicy) / maxSpicy) * 100 - spicy);
        score += 100 - Math.abs(flavors.sweetness - sweet);
        score += 100 - Math.abs(flavors.savoriness - umami);
        score /= 7;

        // Saves score to recipe json entry in recipeList
        recipeList[i].score = score;
      }
    }

    // sort list
    const sortedList = [...recipeList].sort((a, b) => b.score - a.score);
    
    setRecipeList(sortedList);
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
      'x-rapidapi-key': '5e280eff54msh125ec8c51385101p131466jsne19c66db25b6',
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