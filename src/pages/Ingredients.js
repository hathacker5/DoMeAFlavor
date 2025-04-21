import "../App.css";
import "./Ingredients.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { BsPlusCircle, BsDashCircle } from "react-icons/bs";
import { useState } from "react";
import React from 'react';
import { Button, Modal } from 'react-bootstrap';


const WaveHeader = ({subtitle, title}) => {
  return (
    <div className="wave-header">
      <div className="header-content">
        <h2 className = "header-subtitle">{subtitle}</h2>
        <h1 className ="header-text">{title}</h1>
      </div>
      <svg
        className="wave-svg"
        viewBox="0 0 1440 150"
        style={{ transform: 'rotate(180deg)' }}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#ffffff"
          d="M0,64 C480,120 960,0 1440,64 L1440,0 L0,0 Z"
        />
      </svg>
    </div>
  );
}

function Ingredients(props) {
  const userIngredientList = props.userIngredientList;
  const setUserIngredientList = props.setUserIngredientList;

  const [searchResults, setSearchResults] = useState([]);

  return (
    <div>
      <IngredientsHeader list={userIngredientList} />

      <div className="container">
  
        {/* <button onClick={() => (setUserIngredientList([...userIngredientList, "apple"]))}>Debug: Add apple</button>
        <button onClick={() => (setUserIngredientList([...userIngredientList, "butter"]))}>Debug: Add butter</button>
        <button onClick={() => (setUserIngredientList([...userIngredientList, "walnuts"]))}>Debug: Add walnuts</button> */}



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

          <div className = "IngredientListHeader">
          <p><br/>My Ingredients:</p>
          </div>
          <div className = "ingredListCurr">
          <CurrentIngredients 
            list={userIngredientList} 
            ingredientList={userIngredientList}
            setIngredientList={setUserIngredientList}
          />
          </div>

          {/* buttons */}
          <div className="footer-buttons-con">
            <div className="footer-back">
              <Link to="/">
                <button className="footback" >Back</button>
              </Link> 
            </div>
            <div className="footer-next">
              <Link to="/Flavors" onClick={(e) => handleIngredientsNext(e, userIngredientList.length === 0)} 
                  state={{userIngredientList: {userIngredientList}}}>  
                <button className="footnext" >Next</button>
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
    <div className = "searchbox">
      <input
        type="text"
        placeholder="Search for ingredients"
        value={searchText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <svg xmlns="http://www.w3.org/2000/svg" className = "searchIcon" width="40" height="30" fill="#2bc1cc" class="bi bi-search" viewBox="0 0 16 16" onClick = {() =>  {handleSearch (searchText, setSearchResults)}}>
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
      </svg>
      <p className = "searchingfor">SEARCHING FOR: {searchText.toUpperCase()}</p>
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
        <img src={`https://img.spoonacular.com/ingredients_100x100/${image}`} alt={"An image of " + name} class="img-fluid rounded float-left"/>        </div>
        <div className="col-7">
          <div className="row ingredname">
            <b>{name}</b>
          </div>
        </div>
        <div className="col-2">
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
    <div>
    <div className="header">
      <div className="header-buttons-con">
        <div className="nav-button">
          <Link to="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-arrow-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
          </svg>
          </Link>
        </div>
        <div className="nav-button">
          <Link to="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-house-door" viewBox="0 0 16 16">
          <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/>
          </svg>
          </Link>
        </div>

        {/* My Recipe (current user selections) */}
        <div className="header-recipe">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-list" viewBox="0 0 16 16" onClick={handleShow}>
        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
        </svg>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title className = "modal-header">My Current Recipe</Modal.Title>
            </Modal.Header>
            <Modal.Body className = "modal-body">
              <p>My Ingredients: </p>
              <HeaderIngredients list={list.list} />
            </Modal.Body>
            <Modal.Footer>
              <Button className="modal-button" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* <button className="btn btn-primary" onClick={() => alert("my Recipe tracking feature coming soon!")} > ≡ </button> */}
        </div>
      </div>
    </div>
    <div>
      <WaveHeader subtitle = "PICK YOUR" title= "Ingredients" />
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