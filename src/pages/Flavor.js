import "../App.css";
import "./Flavor.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import Form from 'react-bootstrap/Form';
import { Button, Modal } from 'react-bootstrap';

function Flavor(props) {
  const userFlavorPreference = props.userFlavorPreference;
  const setUserFlavorPreference = props.setUserFlavorPreference;
  console.log(userFlavorPreference);
  
  return (
    <div>
      <FlavorHeader list={props} />

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
          <img src={`../../public/images/icon_${name}.svg`} alt={`${name} icon`} className="flavor-icon" />
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

const FlavorHeader = ( list, flavors ) => {
  console.log("list is", list);
  console.log("list.list.userFlavorPreference is", list.list.userFlavorPreference);
  console.log("list.list.userIngrednient is", list.list.userIngredientList);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
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
              <HeaderIngredients list={list.list.userIngredientList} />
              <p>My Flavors: </p>
              <HeaderFlavors flavors={list.list.userFlavorPreference} />
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
  console.log("list in headeringredients", list);
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

function HeaderFlavors ({ flavors }) {
  console.log("headerflavors:", flavors);

  return (
    <div className="myrecipe-list">
      {Array.from(flavors.entries()).map(([key, value]) => (
        <p key={key}>
          {key}: {value}%
        </p>
      ))}
    </div>
  );
  // console.log(flavors.flavors);
  // let vals = Array.from(flavors.values());
  // let nonZeroVals = vals.filter(value => (value !== 0 && value !== '0'));
  // if (nonZeroVals.length > 0) {
  //   return (
  //     <div className="myrecipe-list">
  //       {nonZeroVals.map((item, index) => (
  //         <p>{item}</p>
  //       ))}
  //     </div>
  //   );
  // } else {
  //   return (
  //   <p className="myrecipe-err">
  //     No Flavors added.
  //   </p> 
  //   );
  // }
}

// Checks that the list isn't too small
function handleFlavorsNext (e, userIngredientList) {
  // there are less than two non-zero values
  let vals = Array.from(userIngredientList.values());
  let nonZeroVals = vals.filter(value => (value !== 0 && value !== '0'));
  let isTooSmall = (nonZeroVals.length < 2);
  // console.log("vals", vals, "numz", numZeros, "ist", isTooSmall);
  if (isTooSmall) {
    e.preventDefault(); // Prevent the default link behavior (don't move)
    alert("Please pick at least two flavors.");
  }
};

export default Flavor;
