import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import { useState } from "react";

function Flavor(props) {
  const userFlavorPreference = props.userFlavorPreference;
  const setUserFlavorPreference = props.setUserFlavorPreference;
  
  return (
    <div>
      {console.log(userFlavorPreference)}
      <FlavorHeader />
      <div className="container">
        <Link to="/Ingredients">
          <button>Back</button>
        </Link> 
        <Link to="/RecipeList">
          <button>Next</button>
        </Link>

        {Array.from(userFlavorPreference.entries()).map(([flavor, preference]) => (
          <SingleFlavor
            key={flavor}
            name={flavor}
            preference={preference}
            userFlavorPreference={userFlavorPreference}
            setUserFlavorPreference={setUserFlavorPreference}
          />
        ))}

        {/* buttons, repeated */}
        <Link to="/Ingredients">
          <button>Back</button>
        </Link> 
        <Link to="/RecipeList">
          <button>Next</button>
        </Link>
      </div>
    </div>
  );
}

// todo add image
const SingleFlavor = ( {name, preference, userFlavorPreference, setUserFlavorPreference} ) => {
  return (
    <div>
      <div className="row">
        <div className="col-3">
          {/* <img src="images/"></img> */}
        </div>
        {console.log(name, preference)}

        <div className="col-9">
          <div className="row"><p>{name}</p></div>
          <div className="row">
            <Slider name={name} preference={preference} userFlavorPreference={userFlavorPreference} setUserFlavorPreference={setUserFlavorPreference} />
          </div>
        </div>
      </div>
    </div>
  );
};

function Slider({name, preference, userFlavorPreference, setUserFlavorPreference}) {
  
  const handleSliderChange = (e) => {
    setUserFlavorPreference(prev => {
      const newMap = new Map(prev);
      newMap.set(name, e.target.value);
      return newMap;
    });
  };

  var className = "custom-slider slider icon_" + name.toLowerCase();

  return (
      <div className="outer">
          <div className="slidecontainer">
              <Form.Label>
                  Range Slider
              </Form.Label>
              <Form.Range
                  value={preference}
                  name={name}
                  onChange={handleSliderChange}
                  className={className}/>
              <p>Selected Value: {preference}</p>
          </div>
      </div>
  );
}

const FlavorHeader = () => {
  return (
    <div>
      <div className="row">
        <div className="col-2">
          <Link to="/Ingredients">
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
