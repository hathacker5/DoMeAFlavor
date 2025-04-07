import "../App.css";
import "./RecipeList.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import RecipePage from "./RecipePage";

function RecipeList(props) {
  const userIngredientList = props.userIngredientList;
  const setUserIngredientList = props.setUserIngredientList;
  const userFlavorPreference = props.userFlavorPreference;
  const setUserFlavorPreference = props.setUserFlavorPreference;
  const userRecipeList = props.userRecipeList;
  const setUserRecipeList = props.setUserRecipeList;

  const [openRecipeId, setOpenRecipeId] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  return (
    <div>
      <RecipeListHeader />

      <div className="container">

        {/* buttons */}
        <div className="footer-buttons-con">
          <div className="footer-back">
            <Link to="/Flavors">
              <button className="btn btn-primary">Back</button>
            </Link> 
          </div>
          <div className="footer-next">
            <Link to="/">
              <button className="btn btn-primary">Go Home</button>
            </Link>
          </div>
        </div>

        {/* {console.log("userFlavorPreference", userFlavorPreference)} */}
        <div className="get-recipes-button">
          <button onClick={() => getRecipes(userIngredientList, userFlavorPreference, userRecipeList, setUserRecipeList, setLoading, setLoadingError)} className="btn btn-primary">
            Get Recipes
          </button>
        </div>

        <Loading loading={loading} loadingError={loadingError} />

        {userRecipeList.map((recipe) => (
          <div>
            <RecipeCard recipe={recipe} setOpenRecipeId={setOpenRecipeId} />

            <RecipePage openRecipeId={openRecipeId} setOpenRecipeId={setOpenRecipeId} recipe={recipe} userIngredientList={userIngredientList} setUserIngredientList={setUserIngredientList}>
              Recipe for {recipe.title}  
            </RecipePage>
          </div>
        ))}
      </div>
    </div>
  );
}
const RecipeCard = ({ recipe, setOpenRecipeId }) => {
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
          paddingLeft: "0px",
          marginLeft: "0px",
        }}
      >
        <Card.Body>
          <Card.Title className="card-title">
            <b>{recipe.title}</b>
          </Card.Title>
          <Card.Text>
            <div className="card-contents">
              <img src={recipe.image} alt={recipe.title} />
              <br/>
              <p className="popup-match">{parseInt(recipe.score)}% flavor match<br /></p>
              <div className="popup-button">
                <button onClick={() => setOpenRecipeId(recipe.id)} className="btn btn-primary"> 
                  Open Recipe for {recipe.title}. 
                </button>
              </div>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

// returns a sorted list of recipes based on flavor profile match
const getRecipes = async (userIngredientList, userFlavorPreference, userRecipeList, setUserRecipeList, setLoading, setLoadingError) => {
  console.log("getting recipes with userIngredientList=",userIngredientList, " and userIngredientList=",userIngredientList);
  setLoading(true);
  setLoadingError(false);

  const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?ingredients=${userIngredientList}&number=10&ignorePantry=true&ranking=1`;
  const options = {
    method: "GET",  
    headers: {
      "x-rapidapi-key": "de53ce264cmshed6bd56bbc93472p1bddc7jsnd607dc0f88ca",
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    },
  };

  try {
    console.log("in try block");
    console.log("user flavor pref", userFlavorPreference); //, " userFlavorPreference.get(Bitter)"); //, userFlavorPreference.get("Bitter"));
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
    console.log("in error block");
    console.error(error);
    setLoadingError(true);
  } finally {
    console.log("in finally block");
    console.log("got userRecipeList", userRecipeList)
    setLoading(false);
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

const RecipeListHeader = () => {
  return (
    <div className="header">
      <div className="header-buttons-con">
        <div className="nav-button">
          <Link to="/Flavors">
          <button className="btn btn-primary" >Back</button>
          </Link>
        </div>
        <div className="nav-button">
          <Link to="/">
          <button className="btn btn-primary" >Home</button>
          </Link>
        </div>
        <div className="header-recipe">
          <button className="btn btn-primary" onClick={() => alert("my Recipe tracking feature coming soon!")} > ≡ </button>
        </div>
      </div>
      <div className="header-title">
        Find Recipes with Matching Flavors
      </div>
    </div>
  );
}

function Loading ({ loading, loadingError }) {
  if (loading) {
    return (
      <div>
        <p>
          Loading...
        </p>
      </div>
    )
  } else if (loadingError) {
    return (
      <div>
        <p>
          Error Getting Recipes (API call probably failed, check debug console)
        </p>
      </div>
    )
  }
}

export default RecipeList;