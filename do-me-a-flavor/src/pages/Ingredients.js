import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header.js";
import { Outlet, Link } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";
import { BsDashCircle } from "react-icons/bs";
import { useState } from "react";

// default ingredients the user can choose from; they can search up more
const initialIngredientList = [
    {
      id: 1,
      title: "Gyoza",
      description: "Japanese dumplings",
      imageName: "gyoza.png",
      price: 5.99,
    },
    {
      id: 2,
      title: "Sushi",
      description: "Japanese rice rolls",
      imageName: "sushi.png",
      price: 6.99,
    },
    {
      id: 3,
      title: "Ramen",
      description: "Japanese noodle soup",
      imageName: "ramen.png",
      price: 7.99,
    },
    {
      id: 4,
      title: "Matcha Cake",
      description: "Japanese green tea cake",
      imageName: "matcha-cake.png",
      price: 4.99,
    },
    {
      id: 5,
      title: "Mochi",
      description: "Japanese rice cake",
      imageName: "mochi.png",
      price: 3.99,
    },
    {
      id: 6,
      title: "Yakitori",
      description: "Japanese skewered chicken",
      imageName: "yakitori.png",
      price: 2.99,
    },
    {
      id: 7,
      title: "Takoyaki",
      description: "Japanese octopus balls",
      imageName: "takoyaki.png",
      price: 5.99,
    },
    {
      id: 8,
      title: "Sashimi",
      description: "Japanese raw fish",
      imageName: "sashimi.png",
      price: 8.99,
    },
    {
      id: 9,
      title: "Okonomiyaki",
      description: "Japanese savory pancake",
      imageName: "okonomiyaki.png",
      price: 6.99,
    },
    {
      id: 10,
      title: "Katsu Curry",
      description: "Japanese curry with fried pork",
      imageName: "katsu-curry.png",
      price: 9.99,
    },
  ];




function Ingredients(){
    const [ingredientList, setIngredientList] = useState([]); // list of names of the ingredients

    return(
        <div classname = "container">
             {initialIngredientList.map((item) => (
                <IngredientItem
                    name={item.title}
                    description={item.description}
                    image={"./images/" + item.imageName}
                    ingredientList={ingredientList}
                    setIngredientList={setIngredientList}
                />
                ))}
            <IngredientItem name = "potato" image = ":)" description="A yummy potatoooo" ingredientList={ingredientList} setIngredientList={setIngredientList} />
            <br />
            <button> <Link to="/">Back</Link> </button>
            <button> <Link to="/Flavors">Next</Link> </button>
            <br />
            
        </div>
    )
}

// renders the name, image, and description of one ingredient
const IngredientItem = ({ name, image, description, ingredientList, setIngredientList }) => {
    // const isIngredientInList = ;

    
    return (
        <div className="container" >
            <div className="row">
                <div className="col-3">
                    <img src={image} alt={"An image of "+name} class="img-fluid rounded float-left"/>
                </div>
                <div className="col-8">
                    <div className="row">
                        <b>{name}</b>
                    </div>
                    <div className="row">
                        <p>{description}</p>
                    </div>
                </div>
                <div className="col-1">
                    {/* { ingredientList.includes(name) && (<div> This gets rendered when sold is true</div>)} */}
                    {/* { !ingredientList.includes(name) && (<div> This gets rendered when sold is true</div>)} */}
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