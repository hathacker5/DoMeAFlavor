import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header.js";
import { Outlet, Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import { useState } from "react";


function Flavor() {
  const [spicy, setSpicy] = useState(50); 
  const [sweet, setSweet] = useState(50); 
  const [salty, setSalty] = useState(50); 
  const [bitter, setBitter] = useState(50); 
  const [rich, setRich] = useState(50); 
  const [umami, setUmami] = useState(50); 
  const [sour, setSour] = useState(50); 
  
  return (
    <div className="container">
      <Header />
      <button> <Link to="/Ingredients">Back</Link> </button>
      <button> <Link to="/RecipeList">Next</Link> </button>
      <SingleFlavor name="Spicy" flavor={spicy} setFlavor={setSpicy} />
      <SingleFlavor name="Sweet" flavor = {sweet} setFlavor={setSweet} /> 
      <SingleFlavor name="Salty" flavor={salty} setFlavor={setSalty}/>
F      <SingleFlavor name="Bitter" flavor={bitter} setFlavor={setBitter} />
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
            <p>
                Slider bar
            </p>
            <RangeExample flavor={flavor} setFlavor={setFlavor} />
            {/* <label for="customRange1" class="form-label">Example range</label>
<input type="range" class="form-range" id="customRange1"></input> */}

          </div>
        </div>
      </div>
    </div>
  );
};

function RangeExample({flavor, setFlavor}) {

  const handleSliderChange = (e) => {
      // setSliderValue(e.target.value);
      setFlavor(e.target.value);
  };

  return (
      <div className="outer">
          <div>
              <Form.Label>
                  Range Slider
              </Form.Label>
              <Form.Range
                  value={flavor}
                  name='hello'
                  onChange={handleSliderChange}
                  className="custom-slider"/>
              <p>Selected Value: {flavor}</p>
          </div>
      </div>
  );
}

export default Flavor;
