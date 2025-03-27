import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header.js";
import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { useLocation } from 'react-router-dom';

const ingredientList2 = ["apple", "sugar", "flour"];


function RecipeList() {
    const [recipeList, setRecipeList] = useState([]);
    
    // getting data from Flavor: ingredient list and flavor settings
    const location = useLocation();
    const {ingredientList, spicy, sweet, salty, bitter, rich, umami, sour} = location.state || {ingredientList: [], spicy: 0, sweet: 0, salty: 0, bitter: 0, rich: 0, umami: 0, sour: 0};
    // console.log("Ingredient list in recipe list page: ", ingredientList);
    // console.log("Spicy value in ingredient list page", spicy);
    // console.log("sweet value in ingredient list page", sweet);
    // console.log("salty value in ingredient list page", salty);
    // console.log("bitter value in ingredient list page", bitter);
    // console.log("rich value in ingredient list page", rich);
    // console.log("umami value in ingredient list page", umami);
    // console.log("sour value in ingredient list page", sour);

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
