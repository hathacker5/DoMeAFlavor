import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';

function Flavor(props) {
  const userFlavorPreference = props.userFlavorPreference;
  const setUserFlavorPreference = props.setUserFlavorPreference;
  console.log(userFlavorPreference);
  
  return (
    <div>
      <FlavorHeader />

      <div className="container">

        <div className="flavors-con">
          {Array.from(userFlavorPreference.entries()).map(([flavor, preference]) => (
            <SingleFlavor
              key={flavor}
              name={flavor}
              preference={preference}
              userFlavorPreference={userFlavorPreference}
              setUserFlavorPreference={setUserFlavorPreference}
            />
          ))}
        </div>
        
        {/* buttons */}
        <div className="footer-buttons-con">
          <div className="footer-back">
            <Link to="/Ingredients">
              <button className="btn btn-primary" >Back</button>
            </Link> 
          </div>
          <div className="footer-next">
            <Link to="/RecipeList" onClick={(e) => handleFlavorsNext(e, userFlavorPreference)}>
              <button className="btn btn-primary" >Next</button>
            </Link>
          </div>
        </div> 
      </div>
    </div>
  );
}

const SingleFlavor = ( {name, preference, userFlavorPreference, setUserFlavorPreference} ) => {
  return (
    <div>
      <div className="row">
        <div className="col-3">
          <img src={`./images/icon_${name}.svg`} alt={`${name} icon`} className="flavor-icon" />
        </div>
        <div className="col-9">
          <h2>{name}</h2>
          <Slider name={name} preference={preference} userFlavorPreference={userFlavorPreference} setUserFlavorPreference={setUserFlavorPreference} />
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
        <Form.Range
          value={preference}
          name={name}
          onChange={handleSliderChange}
          className={className}/>
        <p className="slidecontainer-percent">{preference}%</p>
      </div>
    </div>
  );
}

const FlavorHeader = () => {
  return (
    <div className="header">
      <div className="header-buttons-con">
        <div className="nav-button">
          <Link to="/Ingredients">
          <button className="btn btn-primary" >Back</button>
          </Link>
        </div>
        <div className="nav-button">
          <Link to="/">
          <button className="btn btn-primary" >Home</button>
          </Link>
        </div>
        <div className="header-recipe">
          <button className="btn btn-primary" onClick={() => alert("my Recipe tracking feature coming soon!")} > ≡ </button>
        </div>
      </div>
      <div className="header-title">
        Customize Your Flavor Profile
      </div>
    </div>
  );
}

// Checks that the list isn't too small
function handleFlavorsNext (e, userIngredientList) {
  // there are less than two non-zero values
  let vals = Array.from(userIngredientList.values());
  let numZeros = vals.filter(value => (value !== 0 && value !== '0'));
  let isTooSmall = (numZeros.length < 2);
  // console.log("vals", vals, "numz", numZeros, "ist", isTooSmall);
  if (isTooSmall) {
    e.preventDefault(); // Prevent the default link behavior (don't move)
    alert("Please pick at least two flavors.");
  }
};

export default Flavor;
