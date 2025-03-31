import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header.js";
import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { useLocation } from 'react-router-dom';

// const ingredientList2 = ["apple", "sugar", "flour"];


function RecipeList() {
    const [recipeList, setRecipeList] = useState([]);
    
    // getting data from Flavor: ingredient list and flavor settings
    const location = useLocation();
    const {ingredientList, spicy, sweet, salty, bitter, rich, umami, sour} = location.state || {ingredientList: [], spicy: 0, sweet: 0, salty: 0, bitter: 0, rich: 0, umami: 0, sour: 0};
    // console.log("Ingredient list in recipe list page: ", ingredientList);
    // console.log("ingredient list to string: ", ingredientList.ingredientList.ingredientList)
    // console.log("Spicy value in ingredient list page", spicy);
    // console.log("sweet value in ingredient list page", sweet);
    // console.log("salty value in ingredient list page", salty);
    // console.log("bitter value in ingredient list page", bitter);
    // console.log("rich value in ingredient list page", rich);
    // console.log("umami value in ingredient list page", umami);
    // console.log("sour value in ingredient list page", sour);

  return (
    <div className="container">
      {/* <SingleRecipe name="spaghet" match="69 spaghet" />
      <SingleRecipe name="potato" match="420" /> */}
      <button>
        {" "}
        <Link to="/Flavors">Back</Link>{" "}
      </button>
      <button onClick={() => getRecipeIDs(ingredientList, setRecipeList, spicy.spicy, sweet.sweet, salty.salty, bitter.bitter, rich.rich, umami.umami, sour.sour)}>
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

const getRecipeIDs = async (ingredientList, setRecipeList, spicy, sweet, salty, bitter, rich, umami, sour) => {
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
      const flavors = await getFlavorProfile(recipe.id);


      var score = 0.0;
      console.log("flavors is ", flavors);
      console.log("bitter score", bitter, "and", 100 - (Math.abs(flavors.bitterness - bitter)));
      console.log("flavors.bitterness", flavors.bitterness);
      console.log("flavors.fattiness", flavors.fattiness);
      console.log("flavors.saltiness", flavors.saltiness);
      console.log("flavors.sourness", flavors.sourness);
      console.log("flavors.spiciness", flavors.spiciness);
      console.log("flavors.sweetness", flavors.sweetness);
      console.log("flavors.savoriness", flavors.savoriness);

      score += 100 - Math.abs(flavors.bitterness - bitter);
      console.log("Score after bitter: ", score);
      score += 100 - Math.abs(flavors.fattiness - rich);
      console.log("rich score", 100 - Math.abs(flavors.fattiness - rich));
      console.log("Score after rich: ", score);
      score += 100 - Math.abs(flavors.saltiness - salty);
      console.log("Score after salty: ", score);
      score += 100 - Math.abs(flavors.sourness - sour);
      const maxSpicy = 4500000;
      score += 100 - Math.abs((Math.min(flavors.spiciness, maxSpicy) / maxSpicy) * 100 - spicy);
      console.log("savoriness ", flavors.savoriness, ", score ", (100 - Math.abs(flavors.savoriness - umami)));
      score += 100 - Math.abs(flavors.sweetness - sweet);
      console.log("sweetness ", flavors.sweetness, ", score ", (100 - Math.abs(flavors.savoriness - umami)));
      score += 100 - Math.abs(flavors.savoriness - umami);
      console.log("savoriness ", flavors.savoriness, ", score ", (100 - Math.abs(flavors.savoriness - umami)));
      score /= 7;
      console.log("Calculated score for recipe ", i, " is ", score);

      recipeList[i].score = score;
      console.log("Recipe ", i, "has entry", recipeList[i]);
    }

    // console.log("unsorted recipeList: ", recipeList);
    const sortedList = [...recipeList].sort((a, b) => b.score - a.score);
    console.log("sorted sortedList: ", sortedList);
    
    // setRecipeList(recipeList);
    setRecipeList(sortedList);
  } catch (error) {
    console.error(error);
  }
};


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
	console.log(result);
  return result;
} catch (error) {
	console.error(error);
  return [];
}

};

// assumes every item in list has a field called score
// const sortByScore = (list) => {
//   list.sort((a,b) => a.score - b.score);
//   list.map((item, i) => (<div key={i}> {item.matchID}  
//                       {item.score} {item.description}</div>))
// }
// const SingleRecipe = ({ name, match }) => {
//   return (
//     <div>
//       <div>{name}</div>
//       <div>{match}</div>
//       <button>I like this recipe :D </button>
//     </div>
//   );
// };

export default RecipeList;
