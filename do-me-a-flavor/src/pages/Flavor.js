import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import { useState } from "react";

function Flavor() {
  // tow cases: got to this page with next or back button. load data appropriately
  
  // attempt to catch 'back' button data
  const location = useLocation();
  const {flavorIngredientsList, flavorSpicy, flavorSweet, flavorSalty, flavorBitter, flavorRich, flavorUmami, flavorSour} = location.state || {ingredientList: [], flavorSpicy: 0, flavorSweet: 0, flavorSalty: 0, flavorBitter: 0, flavorRich: 0, flavorUmami: 0, flavorSour: 0};
  var initialSpicy = (flavorSpicy != null) ? flavorSpicy.flavorSpicy : 0;
  var initialSweet = (flavorSweet != null) ? flavorSweet.flavorSweet : 0;
  var initialSalty = (flavorSalty != null) ? flavorSalty.flavorSalty : 0;
  var initialBitter = (flavorBitter != null) ? flavorBitter.flavorBitter : 0;
  var initialRich = (flavorRich != null) ? flavorRich.flavorRich : 0;
  var initialUmami = (flavorUmami != null) ? flavorUmami.flavorUmami : 0;
  var initialSour = (flavorSour != null) ? flavorSour.flavorSour : 0;
    
  // Case: it was 'back' button data. set initials here.
  var initialIngredientList = [];
  if (flavorIngredientsList != null && flavorIngredientsList.length != 0) {
    initialIngredientList = flavorIngredientsList.flavorIngredientsList;
  } else {
    // get data from previous page (note that ingredientList is diff than one outside)
    const {ingredientList} = location.state || {ingredientList: []}; // not used here. passed onto next page
    initialIngredientList = ingredientList;
  }
  const ingredientList = initialIngredientList;

  // initialize this page's variables
  const [spicy, setSpicy] = useState(initialSpicy); 
  const [sweet, setSweet] = useState(initialSweet);
  const [salty, setSalty] = useState(initialSalty);
  const [bitter, setBitter] = useState(initialBitter);
  const [rich, setRich] = useState(initialRich);
  const [umami, setUmami] = useState(initialUmami);
  const [sour, setSour] = useState(initialSour);
  
  // setup 'back' button variables for previous page
  const backIngredientsList = ingredientList;
  
  return (
    <div>
      <FlavorHeader backIngredientsList={backIngredientsList} />
      <div className="container">
        {/* buttons */}
        <Link to="/Ingredients" state={{backIngredientsList: {backIngredientsList}}}>
          <button>Back</button>
        </Link> 
        <Link to="/RecipeList" state={{ingredientList: {ingredientList}, spicy: {spicy}, sweet: {sweet}, salty: {salty}, bitter: {bitter}, rich: {rich}, umami: {umami}, sour: {sour} }}>
          <button>Next</button>
        </Link>
        
        <SingleFlavor name="Spicy" flavor={spicy} setFlavor={setSpicy} />
        <SingleFlavor name="Sweet" flavor = {sweet} setFlavor={setSweet} /> 
        <SingleFlavor name="Salty" flavor={salty} setFlavor={setSalty}/>
        <SingleFlavor name="Bitter" flavor={bitter} setFlavor={setBitter} />
        <SingleFlavor name="Rich" flavor={rich} setFlavor={setRich} />
        <SingleFlavor name="Umami" flavor={umami} setFlavor={setUmami} />
        <SingleFlavor name="Sour" flavor={sour} setFlavor={setSour}/>

        {/* buttons, repeated */}
        <Link to="/Ingredients" state={{ingredientList}}>
          <button>Back</button>
        </Link> 
        <Link to="/RecipeList" state={{ingredientList: {ingredientList}, spicy: {spicy}, sweet: {sweet}, salty: {salty}, bitter: {bitter}, rich: {rich}, umami: {umami}, sour: {sour} }}>
          <button>Next</button>
        </Link>
      </div>
    </div>
  );
}

// todo add image
const SingleFlavor = ({ name, flavor, setFlavor, image }) => {
  return (
    <div>
      <div className="row">
        <div className="col-3">
          {/* <img src="images/"></img> */}
        </div>

        <div className="col-9">
          <div className="row"><p>{name}</p></div>
          <div className="row">
            <Slider name={name} flavor={flavor} setFlavor={setFlavor} />
          </div>
        </div>
      </div>
    </div>
  );
};

function Slider({name, flavor, setFlavor}) {
  const handleSliderChange = (e) => {
      setFlavor(e.target.value);
  };

  var classname="custom-slider slider icon_"+name.toLowerCase();

  return (
      <div className="outer">
          <div className="slidecontainer">
              <Form.Label>
                  Range Slider
              </Form.Label>
              <Form.Range
                  value={flavor}
                  name='hello'
                  onChange={handleSliderChange}
                  className={classname}/>
              <p>Selected Value: {flavor}</p>
          </div>
      </div>
  );
}

const FlavorHeader = (backIngredientsList) => {
  return (
    <div>
      <div className="row">
        <div className="col-2">
          <Link to="/Ingredients" state={{backIngredientsList: {backIngredientsList}}}>
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

// todo prevent copy paste: convert back buttons into small functions

export default Flavor;
