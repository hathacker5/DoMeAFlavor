import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header.js";
import { Outlet, Link } from "react-router-dom";

function RecipeList(){
     return(
            <div classname = "container">
                <SingleRecipe name = "spaghet" match = "69 spaghet" />
                <SingleRecipe name = "potato" match = "420" />
                <button> <Link to="/Flavors">Back</Link> </button>
            </div>
        )
}
const SingleRecipe = ({name, match}) => {
    return (
        <div>
            <div>{name}</div>
            <div>{match}</div>
            <button>I like this recipe :D </button>
        </div>
    )
}

export default RecipeList;