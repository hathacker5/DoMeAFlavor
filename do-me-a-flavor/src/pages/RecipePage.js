import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useState } from "react";


function RecipePage(){
    const [instructionList, setInstructionList] = useState([]);
    const location = useLocation();
    const { recipeData } = location.state || { recipeData: [] }
    console.log(recipeData);
    console.log(recipeData.recipe);
    return (
        <div>
            <Link to="/">
                <button>Go Home</button>
            </Link>
            <button onClick = {()=> fetchRecipeInstructions(recipeData.recipe.id, setInstructionList)}>display recipe</button>
            <h1>{recipeData.recipe.title}</h1>
            <img src= {recipeData.recipe.image}></img>
            {instructionList.map((step, index) => (
                      <div>
                        <h2>Step {step.number}</h2>
                        <p>{step.step}</p>
                      </div>
                    ))}
        </div>
    );
};

const fetchRecipeInstructions = async (recipeID, setInstructionList) => {
    const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeID}/analyzedInstructions?stepBreakdown=true`;
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
        const recipeInstList = Object.entries(result[0].steps).map(([index, value]) => value);
        console.log("recipeInstructionList", recipeInstList);
        setInstructionList(recipeInstList);
    } catch (error) {
        console.error(error);
    }

    
}

export default RecipePage;