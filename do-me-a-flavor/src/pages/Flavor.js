import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header.js";
import { Outlet, Link } from "react-router-dom";


function Flavor() {
  return (
    <div className="container">
      <Header />
      <button> <Link to="/Ingredients">Back</Link> </button>
      <button> <Link to="/RecipeList">Next</Link> </button>
      <SingleFlavor name="Spicy" />
    </div>
  );
}

const SingleFlavor = ({ name, image }) => {
  return (
    <div>
      <div className="row">
        <div className="col-3">Pic</div>

        <div className="col-9">
          <div className="row"><p>Spicy</p></div>
          <div className="row">
            <p>
                Slider bar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flavor;
