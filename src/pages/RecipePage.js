import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useState } from "react";
import SubstitutionPopup from "./SubstitutionPopup";
import { Button, Modal } from "react-bootstrap";


function RecipePage(props){
    const recipe = props.recipe;
    const userIngredientList = props.userIngredientList;
    const setUserIngredientList = props.setUserIngredientList;

    return props.openRecipeId == recipe.id ? (
        <Modal show={props.openRecipeId == recipe.id} onHide={() => props.setOpenRecipeId("")}>
            <Modal.Header closeButton>
            <Modal.Title>Modal title</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.children}
                <RecipePageCard recipe={recipe} userIngredientList={userIngredientList} setUserIngredientList={setUserIngredientList} />
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => props.setOpenRecipeId("")}>
                Close Recipe.
            </Button>
            </Modal.Footer>
        </Modal>
    ) : (
        ""
    );
};

function RecipePageCard (props) {
    const recipe = props.recipe;
    const userIngredientList = props.userIngredientList;
    const setUserIngredientList = props.setUserIngredientList;

    const [instructionList, setInstructionList] = useState([]);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [missingIngred, setMissingIngred] = useState(recipe.missedIngredients);
    const [newIngred, setNewIngred] = useState([]);
    const [recipeIngred, setRecipeIngred] = useState([]);


    return (
        <div>
            <Link to="/">
                <button>Go Home</button>
            </Link>
            
            <button onClick = {()=>  handleDisplayOnClick(recipe.id, setInstructionList, setRecipeIngred)}>Display Recipe.</button>
            <h1>{recipe.title}</h1>
            <img src= {recipe.image}></img>

            <button onClick={() => setButtonPopup(true)}>Substitute Ingredients</button>
            
            <SubstitutionPopup trigger={buttonPopup} setTrigger={setButtonPopup} missingIngred={missingIngred} setMissingIngred = {setMissingIngred}
            newIngred={newIngred} setNewIngred={setNewIngred} userIngredientList={userIngredientList} setUserIngredientList={setUserIngredientList}>
                <h3>My popup.</h3>
            </SubstitutionPopup>

            {newIngred.map((step, index) => (
                    <div>
                    <h2>Substitution {step.index}</h2>
                    <p>{step}</p>
                    </div>
                ))}

            
            <h1>Ingredients</h1>
            <ul>
                {recipeIngred.map((item, index) => (
                    <li key={index}>
                        <p>{item.name} ( {item.amount.us.value} {item.amount.us.unit} )</p>
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