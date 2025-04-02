import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";

const RecipePage = () => {
  
    const location = useLocation();
    const {recipeData} = location.state || {recipeData: []}
    console.log(recipeData);
    console.log(recipeData.recipe);
    return (
      <div>
        <Link to="/">
          <button>Go Home</button>
        </Link>

        <h1>{recipeData.recipe.title}</h1>
        <p>Recipe here ...</p>
      </div>
    );
  };
  
  export default RecipePage;