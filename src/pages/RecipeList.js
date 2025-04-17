import "../App.css";
import "./RecipeList.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import RecipePage from "./RecipePage";
import Spinner from 'react-bootstrap/Spinner';
import { Button, Modal } from 'react-bootstrap';


const WaveHeader = ({subtitle, title}) => {
  return (
    <div className="wave-header">
      <div className="header-content">
        <h1 className ="header-text">{title}</h1>
        <h2 className = "header-subtitle">{subtitle}</h2>
      </div>
      <svg
        className="wave-svg"
        viewBox="0 0 1440 150"
        style={{ transform: 'rotate(180deg)' }}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#ffffff"
          d="M0,64 C480,120 960,0 1440,64 L1440,0 L0,0 Z"
        />
      </svg>
    </div>
  );
}

function RecipeList(props) {
  const userIngredientList = props.userIngredientList;
  const setUserIngredientList = props.setUserIngredientList;
  const userExclusionList = props.userExclusionList;
  const setUserExclusionList = props.setUserExclusionList;
  const userFlavorPreference = props.userFlavorPreference;
  const setUserFlavorPreference = props.setUserFlavorPreference;
  const userRecipeList = props.userRecipeList;
  const setUserRecipeList = props.setUserRecipeList;
  const tutorialMode = props.tutorialMode;

  const [openRecipeId, setOpenRecipeId] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  const [numRecipesExcluded, setNumRecipesExcluded] = useState(0);

  return (
    <div>
      <RecipeListHeader userIngredientList={userIngredientList} userFlavorPreference={userFlavorPreference}/>

      <div className="container">

        {/* buttons */}
        <div className="footer-buttons-con">
          <div className="footer-back">
            <Link to="/Flavors">
              <button className="footback">Back</button>
            </Link> 
          </div>
          <div className="footer-next">
            <Link to="/">
              <button className="footnext">Home</button>
            </Link>
          </div>
        </div>

        {/* {console.log("userFlavorPreference", userFlavorPreference)} */}
        <div className="get-recipes-button">
          <button onClick={() => getRecipes(userIngredientList, userFlavorPreference, userRecipeList, setUserRecipeList, setLoading, setLoadingError, userExclusionList, setNumRecipesExcluded)} className="getRecipes">
            Get Recipes
          </button>
        </div>

        {tutorialMode ? (<div className = "Tutorial"> <p>
          Click "Get Recipes" to load or update your recipes.
          Click the menu icon on the top right to see your ingredients and flavors.
        </p> </div>) : ""}
        

        <Loading loading={loading} loadingError={loadingError} />

        {userRecipeList.length > 0 ? (<div className = "recexclusions"> <p>{numRecipesExcluded} recipes are excluded from your search.</p> </div>) : ""}

        {userRecipeList.map((recipe) => (
          <div>
            <RecipeCard recipe={recipe} setOpenRecipeId={setOpenRecipeId} />

            <RecipePage openRecipeId={openRecipeId} setOpenRecipeId={setOpenRecipeId} recipe={recipe} userIngredientList={userIngredientList} setUserIngredientList={setUserIngredientList} userExclusionList={userExclusionList} setUserExclusionList={setUserExclusionList}>
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
    <Col sm={12} className="mycard-outer">
    <Card className="mycard">
      <Card.Body className="mycard-body">
        <Card.Title className="card-title">
            <b>{recipe.title}</b>
          </Card.Title>
          <Card.Text>
            <div className="card-contents">
              <img src={recipe.image} alt={recipe.title} className="card-img" />
              <br/>
              <p className="popup-match">{parseInt(recipe.score)}% flavor match<br /></p>
              <div className="popup-button">
                <button onClick={() => setOpenRecipeId(recipe.id)} className="openRecipe"> 
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
const getRecipes = async (userIngredientList, userFlavorPreference, userRecipeList, setUserRecipeList, setLoading, setLoadingError, userExclusionList, setNumRecipesExcluded) => {
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

    const filteredList = sortedList.filter(recipe => !recipeHasExclusion(recipe, userExclusionList));
    setNumRecipesExcluded(sortedList.length - filteredList.length);

    setUserRecipeList(filteredList);
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

function recipeHasExclusion(recipe, userExclusionList) {
  const allIngredients = [
    ...recipe.usedIngredients,
    ...recipe.missedIngredients,
    ...recipe.unusedIngredients,
  ];

  for (const ingredient of allIngredients) {
    if (userExclusionList.includes(ingredient.name.toLowerCase())) {
      return true;
    }
  }

  return false;
}

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

const RecipeListHeader = ({userIngredientList, userFlavorPreference}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
    <div className="header">
      <div className="header-buttons-con">
        <div className="nav-button">
          <Link to="/Flavors">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-arrow-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
          </svg>
          </Link>
        </div>
        <div className="nav-button">
          <Link to="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-house-door" viewBox="0 0 16 16">
          <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/>
          </svg>
          </Link>
        </div>
        <div className="header-recipe">
           <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-list" viewBox="0 0 16 16" onClick={handleShow}>
           <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
           </svg>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title className = "modal-header" >My Current Recipe</Modal.Title>
            </Modal.Header>
            <Modal.Body className = "modal-body">
              <p>My Ingredients: </p>
              <HeaderIngredients list={userIngredientList} />
              <p>My Flavors: </p>
              <HeaderFlavors flavors={userFlavorPreference} />
            </Modal.Body>
            <Modal.Footer>
              <Button className="modal-button" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
       </div>
      </div>
    </div>
    <div>
      <WaveHeader title= "Recipe Search"/>
    </div>
    </div>
  );
}

function Loading ({ loading, loadingError }) {
  if (loading) {
    return (
    
      <div>
        <Spinner animation="border" role="status">
        </Spinner>
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

function HeaderIngredients ({ list }) {
  console.log("list in headeringredients", list);
  if (list.length > 0) {
    return (
      <div className="myrecipe-list">
        {list.map((item, index) => (
          <p>{item}</p>
        ))}
      </div>
    );
  } else {
    return (
    <p className="myrecipe-err">
      No ingredients added.
    </p> 
    );
  }
}

function HeaderFlavors ({ flavors }) {
  console.log("headerflavors:", flavors);

  return (
    <div className="myrecipe-list">
      {Array.from(flavors.entries()).map(([key, value]) => (
        <p key={key}>
          {key}: {value}%
        </p>
      ))}
    </div>
  );
}

export default RecipeList;