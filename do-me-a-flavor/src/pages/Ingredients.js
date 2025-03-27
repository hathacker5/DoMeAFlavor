import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header.js";
import { Outlet, Link } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";
import { BsDashCircle } from "react-icons/bs";
import { useState } from "react";

function Ingredients(){
  const [ingredientList, setIngredientList] = useState([]); // list of names of the ingredients the user selected
  const [searchResults, setSearchResults] = useState([]);       // output of search

  return(
    <div classname = "container">
      <SearchBox searchResults={searchResults} setSearchResults={setSearchResults}></SearchBox>
      {console.log("Search results", searchResults)}
      {console.log("Ingredients list", ingredientList)}


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
      
      {/* <IngredientItem name = "potato" image = ":)" description="A yummy potatoooo" ingredientList={ingredientList} setIngredientList={setIngredientList} /> */}
      <br />
      
      <button> <Link to="/">Back</Link> </button>
      <button> <Link to="/Flavors">Next</Link> </button>
      <br />
      
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
      console.log("Updated results for ", searchText, ": ", searchResults);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for ingredients"
        value={searchText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <p><b>SEARCHING FOR: {searchText.toUpperCase()}</b></p>
    </div>
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
      "x-rapidapi-key": "5e280eff54msh125ec8c51385101p131466jsne19c66db25b6",
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
  
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
          {/* <div className="row">
            <p>{description}</p>
          </div> */}
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

export default Ingredients;