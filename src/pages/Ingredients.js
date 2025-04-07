import "../App.css";
import "./Ingredients.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { BsPlusCircle, BsDashCircle } from "react-icons/bs";
import { useState } from "react";
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

function Ingredients(props) {
  const userIngredientList = props.userIngredientList;
  const setUserIngredientList = props.setUserIngredientList;

  const [searchResults, setSearchResults] = useState([]);

  return (
    <div>
      <IngredientsHeader list={userIngredientList} />

      <div className="container">
  
        <button onClick={() => (setUserIngredientList([...userIngredientList, "apple"]))}>Debug: Add apple</button>
        <button onClick={() => (setUserIngredientList([...userIngredientList, "butter"]))}>Debug: Add butter</button>
        <button onClick={() => (setUserIngredientList([...userIngredientList, "walnuts"]))}>Debug: Add walnuts</button>



        <div className = "ingreds-con">
          <div className="search-input-con">
            <SearchBox searchResults={searchResults} setSearchResults={setSearchResults} />
          </div>

          <div className="search-results-con">
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
              // error handling
              <p className="ingred-err">Couldn't find any ingredients</p>
            )}
          </div>

          <p><br/>My Ingredients:</p>
          <CurrentIngredients 
            list={userIngredientList} 
            ingredientList={userIngredientList}
            setIngredientList={setUserIngredientList}
          />

          {/* buttons */}
          <div className="footer-buttons-con">
            <div className="footer-back">
              <Link to="/">
                <button className="btn btn-primary" >Back</button>
              </Link> 
            </div>
            <div className="footer-next">
              <Link to="/Flavors" onClick={(e) => handleIngredientsNext(e, userIngredientList.length === 0)} 
                  state={{userIngredientList: {userIngredientList}}}>  
                <button className="btn btn-primary" >Next</button>
              </Link>
            </div>
          </div> 
        </div>
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
          <button onClick ={() => updateIngredientList(name, ingredientList, setIngredientList) } className="add-rm-button" > 
            {ingredientList.includes(name) ? <BsDashCircle className="color-red" /> : <BsPlusCircle className="color-green" /> }
          </button>
        </div>
      </div>
    </div>
  )
}

// each item in CurrentIngredients
const CurrentIngredientItem = ({ name, ingredientList, setIngredientList }) => {
  return (
    <div className="ingreds-item" >
      <div className="ingreds-item-name">
        <p>{name}</p>
      </div>
      <div className="ingreds-item-btn">
        <button onClick ={() => (setIngredientList(ingredientList.filter(ingredient => ingredient !== name)))} className="add-rm-button">
          <BsDashCircle className="color-red" /> 
        </button>
      </div>
    </div>
  )
}

// displays current ingredients and allows user to remove them
function CurrentIngredients({ list, ingredientList, setIngredientList }) {
  if (list.length > 0) {
    return (
      <div className="ingreds-list">
        {list.map((item, index) => (
          <CurrentIngredientItem name={item} ingredientList={ingredientList} setIngredientList={setIngredientList} />
        ))}
      </div>
    );
  } else {
    return (
    <p className="ingred-err">
      search to add ingredients
    </p> 
    );
  }
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

const IngredientsHeader = ( list ) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="header">
      <div className="header-buttons-con">
        <div className="nav-button">
          <Link to="/">
          <button className="btn btn-primary" >Back</button>
          </Link>
        </div>
        <div className="nav-button">
          <Link to="/">
          <button className="btn btn-primary" >Home</button>
          </Link>
        </div>

        {/* My Recipe (current user selections) */}
        <div className="header-recipe">
          <Button variant="primary" onClick={handleShow}>
            ≡
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>My Current Recipe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>My Ingredients: </p>
              <HeaderIngredients list={list.list} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* <button className="btn btn-primary" onClick={() => alert("my Recipe tracking feature coming soon!")} > ≡ </button> */}
        </div>
      </div>
      <div className="header-title">
        Customize Your Flavor Profile
      </div>
    </div>
  );
}

function HeaderIngredients ({ list }) {
  if (list.length > 0) {
    return (
      <div className="myrecipe-list">
        {list.map((item, index) => (
          <p>{item}</p>
        ))}
      </div>
    );
  } else {
    return (
    <p className="myrecipe-err">
      No ingredients added.
    </p> 
    );
  }
}

// Checks that the list isn't empty
function handleIngredientsNext (e, isEmpty) {
  if (isEmpty) {
    e.preventDefault(); // Prevent the default link behavior (don't move)
    alert("Please pick at least one ingredient.");
  }
};

export default Ingredients;