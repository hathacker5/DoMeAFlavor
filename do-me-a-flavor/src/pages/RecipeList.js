import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header.js";
import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";

const ingredientList2 = ["apple", "sugar", "flour"];

function RecipeList() {
  const [recipeList, setRecipeList] = useState([]);

  return (
    <div classname="container">
      <SingleRecipe name="spaghet" match="69 spaghet" />
      <SingleRecipe name="potato" match="420" />
      <button>
        {" "}
        <Link to="/Flavors">Back</Link>{" "}
      </button>
      <button onClick={() => getRecipeIDs(ingredientList2, setRecipeList)}>
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
            <b>Recipe ID: {recipe.id}</b>
          </Card.Title>
          {/* <Card.Subtitle style = {{fontSize: '24px', color: 'darkgray'}}><b><em>Subtitle</em></b></Card.Subtitle>
          <Card.Text>
            <b>Terminal:</b> Value <br />
            <b>Aircraft:</b> Value <br />
            <b>Departure:</b> Value <br />
            <b>Arrival:</b> Value
          </Card.Text> */}
          <Card.Text>
            {recipe.title} <br />
            
            <img src={recipe.image} alt={recipe.title} />
            percent match
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

const getRecipeIDs = async (ingredientList, setrecipeList) => {
  const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?ingredients=${ingredientList.toString()}&number=10&ignorePantry=true&ranking=1`;
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
    console.log(result);
    const idList = Object.entries(result).map(([index, value]) => value);
    setrecipeList(idList);
  } catch (error) {
    console.error(error);
  }
};

const SingleRecipe = ({ name, match }) => {
  return (
    <div>
      <div>{name}</div>
      <div>{match}</div>
      <button>I like this recipe :D </button>
    </div>
  );
};

export default RecipeList;
