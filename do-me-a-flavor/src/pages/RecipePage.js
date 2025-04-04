import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useState } from "react";
import SubstitutionPopup from "./SubstitutionPopup";


function RecipePage(props){
    
    // const location = useLocation();
    // const { recipeData } = location.state || { recipeData: [] }
    // console.log("recipe page recipe data ", recipeData);
    const recipe = props.recipe

    return props.trigger ? (
        <div className="popup">
            <div className="popup-inner">
                <button className="close-btn" onClick={() => props.setTrigger(false)}>
                    Close Recipe.
                </button>
                {props.children}

                <RecipePageCard originalIngredientList={props.ingredientList} recipe={recipe} />
            </div>
        </div>
    ) : (
        ""
    );
};

const RecipePageCard = ({originalIngredientList, recipe}) => {
    const [instructionList, setInstructionList] = useState([]);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [missingIngred, setMissingIngred] = useState(recipe.missedIngredients);
    const [newIngred, setNewIngred] = useState([]);

    return (
        <div>
            <Link to="/">
                <button>Go Home</button>
            </Link>
            
            <button onClick = {()=> fetchRecipeInstructions(recipe.id, setInstructionList)}>display recipe</button>
            <h1>{recipe.title}</h1>
            <img src= {recipe.image}></img>

            <button onClick={() => setButtonPopup(true)}>Substitute Ingredients</button>
            
            <SubstitutionPopup trigger={buttonPopup} setTrigger={setButtonPopup} missingIngred={missingIngred} setMissingIngred = {setMissingIngred}
                newIngred={newIngred} setNewIngred={setNewIngred}>
                <h3>My popup.</h3>
            </SubstitutionPopup>

            {newIngred.map((step, index) => (
                    <div>
                    <h2>Substitution {step.index}</h2>
                    <p>{step}</p>
                    </div>
                ))}

            {instructionList.map((step, index) => (
                    <div>
                    <h2>Step {step.index}</h2>
                    <p>{step.step}</p>
                    </div>
                ))}
        </div>
    )
};
// function checkSubstitutions(recipe, setMissingIngred, newIngred, setNewIngred, setButtonPopup) {
// //   setMissingIngred(recipe.missedIngredients);
//   setButtonPopup(true);
//   }

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