import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";
import { BsDashCircle } from "react-icons/bs";
import { useState } from "react";

function Ingredients(props) {
  const userIngredientList = props.userIngredientList;
  const setUserIngredientList = props.setUserIngredientList;

  const [searchResults, setSearchResults] = useState([]);

  return (
    <div>
      <IngredientsHeader />
      <div className="container">
        
        <SearchBox searchResults={searchResults} setSearchResults={setSearchResults} />

        {searchResults.length > 0 ? (
          searchResults.map((item) => (
            <IngredientItem
                name={item.name}
                image={item.image}
                ingredientList={userIngredientList}
                setIngredientList={setUserIngredientList}
            />
          ))
        ) : (
          <p>Couldn't find any ingredients</p>
        )}

        <p>My Ingredients: {userIngredientList.length > 0 ? userIngredientList.join(", ") : "Search to add ingredients"}.</p>

        <Link to="/">
          <button>Back</button>
        </Link> 

        <Link to="/Flavors" onClick={(e) => handleIngredientsNext(e, userIngredientList.length === 0)}>  
          <button>Next</button>
        </Link>

      </div>
    </div>
  )
};

export function SearchBox({ searchResults, setSearchResults }) {
  const [searchText, setSearchText] = useState('');

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(searchText, setSearchResults);
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search for ingredients"
        value={searchText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <p><b>SEARCHING FOR: {searchText.toUpperCase()}</b></p>
    </>
  );
}

const handleSearch = (searchText, setSearchResults) => {
  fetchSearchResults(searchText, setSearchResults); 
};

const fetchSearchResults = async(searchQuery, setSearchResults) => {
  const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/search?query=${searchQuery}`
  
  const options = {
    method: 'GET',
    headers: {
      "x-rapidapi-key": "de53ce264cmshed6bd56bbc93472p1bddc7jsnd607dc0f88ca",
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
  
    if (result.results != null) {
      setSearchResults(result.results); // puts results array from api call into searchResults
    } else {
      setSearchResults(`No results found for ${searchQuery}`);
    }
  } catch (error) {
      console.error(error);
  }
};

// renders the name, image, and description of one ingredient
const IngredientItem = ({ name, image, ingredientList, setIngredientList }) => {
  return (
    <div className="container" >
      <div className="row">
        <div className="col-3">
          <img src={image} alt={"An image of " + name} class="img-fluid rounded float-left"/>
        </div>
        <div className="col-8">
          <div className="row">
            <b>{name}</b>
          </div>
        </div>
        <div className="col-1">
          <button onClick ={() => updateIngredientList(name, ingredientList, setIngredientList) } > 
            {ingredientList.includes(name) ? <BsDashCircle /> : <BsPlusCircle /> }
          </button>
        </div>
      </div>
    </div>
  )
}

const updateIngredientList = ( name, ingredientList, setIngredientList ) => {
    if (ingredientList.includes(name)) {
        // remove
        setIngredientList(ingredientList.filter(ingredient => ingredient !== name));
    } else {
        // add
        setIngredientList([...ingredientList, name]);
    }
};

const IngredientsHeader = () => {
  return (
    <div>
      <div className="row">
        <div className="col-2">
          <Link to="/">
          <button>Back</button>
          </Link>
        </div>
        <div className="col-2">
          <Link to="/">
          <button>Home</button>
          </Link>
        </div>
        <div className="col-8"></div>
      </div>
      <div className="row">
        <div className="col-12">
          Customize Your Flavor Profile
        </div>
      </div>
    </div>
  );
}

// Checks that the list isn't empty
function handleIngredientsNext (e, isEmpty) {
  if (isEmpty) {
    e.preventDefault(); // Prevent the default link behavior (don't move)
    alert("Please pick at least one ingredient.");
  }
};

export default Ingredients;