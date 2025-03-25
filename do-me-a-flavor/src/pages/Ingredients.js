import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header.js";
import { Outlet, Link } from "react-router-dom";


function Ingredients(){
    return(
        <div classname = "container">
            <SingleIngredient name = "potato" image = ":)" />
            <button> <Link to="/">Back</Link> </button>
            <button> <Link to="/Flavors">Next</Link> </button>
        </div>
    )
}
const SingleIngredient = ({ name, image }) => {
    return (
        <div>
            <div>{name}</div>
            <div>{image}</div>
        </div>
    )
}

export default Ingredients;