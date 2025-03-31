import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header.js";
import { Outlet, Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import { useState } from "react";
import { useLocation } from "react-router-dom";


function Flavor() {
  const [spicy, setSpicy] = useState(0); 
  const [sweet, setSweet] = useState(0); 
  const [salty, setSalty] = useState(0); 
  const [bitter, setBitter] = useState(0); 
  const [rich, setRich] = useState(0); 
  const [umami, setUmami] = useState(0); 
  const [sour, setSour] = useState(0); 

  const location = useLocation();
  const {ingredientList} = location.state || {ingredientList: []}; // not used here. passed onto next page
  
  return (
    <div className="container">
      <Header />
      <button> <Link to="/Ingredients">Back</Link> </button>
      <button> <Link to="/RecipeList" state={{ingredientList: {ingredientList}, spicy: {spicy}, sweet: {sweet}, salty: {salty}, bitter: {bitter}, rich: {rich}, umami: {umami}, sour: {sour} }}>Next</Link> </button>
      
      <SingleFlavor name="Spicy" flavor={spicy} setFlavor={setSpicy} />
      <SingleFlavor name="Sweet" flavor = {sweet} setFlavor={setSweet} /> 
      <SingleFlavor name="Salty" flavor={salty} setFlavor={setSalty}/>
      <SingleFlavor name="Bitter" flavor={bitter} setFlavor={setBitter} />
      <SingleFlavor name="Rich" flavor={rich} setFlavor={setRich} />
      <SingleFlavor name="Umami" flavor={umami} setFlavor={setUmami} />
      <SingleFlavor name="Sour" flavor={sour} setFlavor={setSour}/>
    </div>
  );
}

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

export default Flavor;
