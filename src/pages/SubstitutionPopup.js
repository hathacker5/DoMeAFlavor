import "../App.css";
import "./SubstitutionPopup.css";
import React, { useState, useEffect } from 'react';


function SubstitutionPopup(props) {
  return props.trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn btn-close" onClick={() => props.setTrigger(false)}>
        </button>
        
        {props.children}
        <SubstitutionMenu
          missingIngred={props.missingIngred}
          setMissingIngred={props.setMissingIngred}
          userIngerdientList={props.userIngerdientList}
          setUserIngredientList={props.setUserIngredientList}
          userExclusionList={props.userExclusionList}
          setUserExclusionList={props.setUserExclusionList}
          recipeIngred={props.recipeIngred}
          setRecipeIngred={props.setRecipeIngred}
        />
      </div>
    </div>
  ) : (
    ""
  );
}

const SubstitutionMenu = ({
  missingIngred,
  setMissingIngred,
  userIngerdientList,
  setUserIngredientList,
  userExclusionList,
  setUserExclusionList,
  recipeIngred,
  setRecipeIngred
}) => {
  
  const [loadingAlternatives, setLoadingAlternatives] = useState(true);
  const [alternatives, setAlternatives] = useState([]);
  const [updateUserIngredientList, setUpdateUserIngredientList] = useState(false);
  console.log("missing ingredients 2", missingIngred);
  // const missing = missingIngred.length == 0 ? null : missingIngred[0];
  const missingAmount = missingIngred.length == 0 ? null : missingIngred[0].amount;
  const missingAmountUnit = missingIngred.length == 0 ? null : missingIngred[0].unit;
  const missing = missingIngred.length == 0 ? null : missingIngred[0].name;

  
  useEffect(() => {
    if (missing != null) {
        getAlternatives(missing, setLoadingAlternatives)
            .then((alts) => setAlternatives(alts))
            .finally(setLoadingAlternatives(false));
    }
  }, [missing]);

  console.log("alt ingredients: ", alternatives);
  if (missing == null) {
    return <p>No substitutions needed.</p>
  }

  if (!alternatives.includes(missing)){
    setAlternatives((prev) => [...prev, missing]);
  }
  // console.log("name", missing);
  // console.log("alternatives", alternatives);

  return loadingAlternatives ? (<p>Loading substitutions for {missing}</p>) : 
    (alternatives == [] ? <p>Failed to get valid substitutions. Please try again later.</p> : (
        <div>
        <p>
            This recipe requires {missing}. Would you like to add this ingredient to
            your available ingredients? If not, you can choose any of the possible
            substitutions below.
        </p>

        <label>
          <input type="checkbox" checked={updateUserIngredientList} onChange={() => setUpdateUserIngredientList(!updateUserIngredientList)}/>
          Add substitution to ingredients I have.
        </label>
        


        {alternatives.map((alt, index) => (
            <button
            key={index}
            onClick={() => {
                setMissingIngred((prev) => prev.slice(1));
                console.log("missing", missing);
                if (alt != missing) {
                  const currIngred = recipeIngred.find((ingred) => ingred.name == missing);
                  currIngred.name = `${missing} (Substitute ${alt})`;
                }
                
                // console.log("missing after button click", missingIngred);
                // console.log(`message: ${missing} (Substitute ${missingFull} with ${alt})`)
                console.log("Recipe ingred after update: ", recipeIngred)
                // setRecipeIngred((prev) => [...prev, {name: `${missing} (Substitute ${missingFull} with ${alt})`, amount: missingAmount, image: null}]);
                // // [...prev, `${missing} (Substitute ${missingFull} with ${alt})`]
                // console.log("new after button click");
                if (updateUserIngredientList) {
                  setUserIngredientList((prev) => [...prev, `${alt}`]);
                }
            }}
            className="btn btn-secondary"
            >
            {alt}
            </button>
        ))}

        <button onClick={() => {
          setUserExclusionList((prev) => [...prev, `${missing}`]);
          setMissingIngred((prev) => prev.slice(1));
        }}
          className="btn btn-secondary"
          >
          Exclude ingredient.
        </button>
        </div>)
  );
};

const getAlternatives = async (name, setLoadingAlternatives) => {
  console.log("searching name", name);
  const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/substitutes?ingredientName=${name}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "de53ce264cmshed6bd56bbc93472p1bddc7jsnd607dc0f88ca",
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log("result", result);
    if (result.status == "failure") {
        return [];
    }

    // result.substitutes = extractIngredientNames(result.substitutes);
    setLoadingAlternatives(false);
    // return extractIngredientNames(result.substitutes);
    return result.substitutes
  } catch (error) {
    console.error(error);
    setLoadingAlternatives(false);
    return [];
  }
};

function extractIngredientName(name) {
  return name
  .replace(/(\d+\/\d+|\d+)\s*(cup|tsp|tbsp|oz|g|ml|lb|kg)?\s*=?\s*/gi, "")
  .trim();
}

// const extractIngredientNames = (substitutes) => {
//   return substitutes.map((sub) => {
//     // Remove measurements (e.g., "1 cup =", "1/2 tsp", "7/8 cup", etc.)
//     return sub
//       .replace(/(\d+\/\d+|\d+)\s*(cup|tsp|tbsp|oz|g|ml|lb|kg)?\s*=?\s*/gi, "")
//       .trim();
//   });
// };

export default SubstitutionPopup;
