import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";
import { BsDashCircle } from "react-icons/bs";
import { useState } from "react";

const Ingredients = () => {
  // catch 'back' button data
  const location = useLocation();
  const {backIngredientsList} = location.state || {backIngredientsList: []};
  var initialList = [];
  if (backIngredientsList != null && backIngredientsList.length != 0) {
    initialList = backIngredientsList.backIngredientsList.ingredientList;
  } 

  // initialize this page's variables
  const [ingredientList, setIngredientList] = useState(initialList); // list of names of the ingredients the user selected
  const [searchResults, setSearchResults] = useState([]);            // output of search

  return(
    <div>
      <IngredientsHeader />

      <button onClick={() => (setIngredientList([...ingredientList, "apple"]))}>Debug: Add apple</button>
      <p></p>

      <div classname = "container">
        <SearchBox searchResults={searchResults} setSearchResults={setSearchResults}></SearchBox>

        {searchResults.length > 0 ? (
          searchResults.map((item) => (
            <IngredientItem
                name={item.name}
                image={item.image}
                ingredientList={ingredientList}
                setIngredientList={setIngredientList}
            />
          ))
        ) : (
          // error handling
          <p>Couldn't find any ingredients</p>
        )}

        <p>My Ingredients: {ingredientList.length > 0 ? ingredientList.join(", ") : "search to add ingredients"}.</p>

        <br />
        
        {/* buttons */}

        <Link to="/">
          <button>Back</button>
        </Link> 

        <Link to="/Flavors" onClick={(e) => handleIngredientsNext(e, ingredientList.length === 0)} 
            state={{ingredientList: {ingredientList}}}>  
          <button>Next</button>
        </Link>
        
        <br />
      </div>
    </div>
  )
}


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