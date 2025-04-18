import "../App.css";
import "./RecipePage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useState } from "react";
import SubstitutionPopup from "./SubstitutionPopup";
import { Button, Modal } from "react-bootstrap";
import { Prev } from "react-bootstrap/esm/PageItem";




function RecipePage(props){
  // recipe 
  const recipe = props.recipe;
  // user specified 
  const userIngredientList = props.userIngredientList;
  const setUserIngredientList = props.setUserIngredientList;
  // user exclusions 
  const userExclusionList = props.userExclusionList;
  const setUserExclusionList = props.setUserExclusionList;

  return props.openRecipeId == recipe.id ? (
    <Modal show={props.openRecipeId == recipe.id} onHide={() => props.setOpenRecipeId("")}>
      <Modal.Header closeButton>
      <Modal.Title>{recipe.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.children}
        <RecipePageCard recipe={recipe} userIngredientList={userIngredientList} setUserIngredientList={setUserIngredientList} userExclusionList={userExclusionList} setUserExclusionList={setUserExclusionList}/>
      </Modal.Body>
      <Modal.Footer>
      <Button className = "modal-foot" onClick={() => props.setOpenRecipeId("")}>
        Close
      </Button>
      </Modal.Footer>
    </Modal>
  ) : (
    ""
  );
};

function RecipePageCard (props) {
  const recipe = props.recipe;
  // user specified
  const userIngredientList = props.userIngredientList;
  const setUserIngredientList = props.setUserIngredientList;
  // user exclusions
  const userExclusionList = props.userExclusionList;
  const setUserExclusionList = props.setUserExclusionList;

  const [instructionList, setInstructionList] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  // ingredients the user doesn't have 
  const [missingIngred, setMissingIngred] = useState(recipe.missedIngredients);
  // substitutions
  //const [newIngred, setNewIngred] = useState([]);
  // ingredients + amounts specified in the recipe
  const [recipeIngred, setRecipeIngred] = useState([]);

  return (
    <div>
      <div className="recipe-image-con">
        <img src= {recipe.image} className="recipe-image"></img>


        <button className = "Display-Recipe" onClick = {()=>  handleDisplayOnClick(recipe.id, setInstructionList, setRecipeIngred)}>
          Display Recipe
        </button>

        {recipeIngred.length == 0 ? " " : (<button onClick={() => setButtonPopup(true)} className="Substitute-Ingredients">Substitution/Exclusion</button>)}
      </div>
      
      {/*  newIngred={newIngred} setNewIngred={setNewIngred} */}
      
      <SubstitutionPopup trigger={buttonPopup} setTrigger={setButtonPopup} missingIngred={missingIngred} setMissingIngred = {setMissingIngred}
       userIngredientList={userIngredientList} setUserIngredientList={setUserIngredientList} userExclusionList={userExclusionList} setUserExclusionList={setUserExclusionList} recipeIngred={recipeIngred} setRecipeIngred={setRecipeIngred}>
        <h3>Ingredient Substitutions</h3>
      </SubstitutionPopup>

      {/* {newIngred.map((step, index) => (
          <div>
          <h2>Substitution {step.index}</h2>
          <p>{step}</p>
          </div>
        ))} */}

      <h2>Current exclusions:</h2>
      {recipeIngred.length == 0 ? "" : 
      (<ul>
      {userExclusionList.map((ingred, index) => (
        recipeIngred.some(entry => entry.name.includes(ingred.name)) ? 
        (<div key={index}>
            <li>{ingred.name} <button onClick={() => undoExclusion(ingred, setUserExclusionList, setMissingIngred)}>↺</button> </li>
        </div>) : ""
      ))}
      </ul>)}

      
      <h1>Ingredients</h1>
      <ul>
        {recipeIngred.map((item, index) => (
          <li key={index}>
            <p>{item.name} ( {item.amount.us.value} {item.amount.us.unit} ) {item.name.includes("(Substitute") ? (<button onClick={() => undoSubstitution(item, setMissingIngred)}>↺</button>) : ""}</p> 
            
          </li>
        ))}
      </ul>

      <h1>Directions</h1>

      {instructionList.map((step, index) => (
          <div>
          <h2>Step {step.index}</h2>
          <p>{step.step}</p>
          </div>
        ))}
    </div>
  )
};

function undoExclusion(recipe, setUserExclusionList, setMissingIngred) {
  setUserExclusionList((prev) => prev.filter(i => i !== recipe));
  setMissingIngred((prev) => [...prev, recipe]);
}

function undoSubstitution(recipe, setMissingIngred) {
  recipe.name = recipe.name.replace(/ *\(Substitute [^)]*\) */g, "");
  setMissingIngred((prev) => [...prev, recipe])
}

const handleDisplayOnClick = (recipeID, setInstructionList, setRecipeIngred) => {
  fetchRecipeInstructions(recipeID, setInstructionList);
  fetchRecipeIngreds(recipeID, setRecipeIngred);
}



const fetchRecipeIngreds = async (recipeID, setRecipeIngred) => {
  const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeID}/ingredientWidget.json`;
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

    console.log(result);
    setRecipeIngred(result.ingredients);
  } catch (error) {
    console.error(error);
  }
}



const fetchRecipeInstructions = async (recipeID, setInstructionList) => {
  const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeID}/analyzedInstructions?stepBreakdown=true`;
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
    console.log("recipe ID", recipeID);
    console.log("recipe instrctions result", result);
    const recipeInstList = Object.entries(result[0].steps).map(([index, value]) => value);
    console.log("recipeInstructionList", recipeInstList);
    setInstructionList(recipeInstList);
  } catch (error) {
    console.error(error);
  }

  
}

export default RecipePage;