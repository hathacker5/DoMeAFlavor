import React, { useState, useEffect } from 'react';
import "../App.css";


function SubstitutionPopup(props) {
  return props.trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn" onClick={() => props.setTrigger(false)}>
          Close Popup.
        </button>
        {props.children}
        <SubstitutionMenu
          missingIngred={props.missingIngred}
          setMissingIngred={props.setMissingIngred}
          originalIngredientList={props.originalIngredientList}
          setOriginalIngredientList={props.setOriginalIngredientList}
          newIngred={props.newIngred}
          setNewIngred={props.setNewIngred}
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
  originalIngredientList,
  newIngred,
  setNewIngred
}) => {
  
  const [loadingAlternatives, setLoadingAlternatives] = useState(true);
  const [alternatives, setAlternatives] = useState([]);
  console.log("missing ingredients 2", missingIngred);
  const missing = missingIngred.length == 0 ? null : missingIngred[0].name;

  
  useEffect(() => {
    if (missing) {
        getAlternatives(missing, setLoadingAlternatives)
            .then((alts) => setAlternatives(alts))
            .finally(setLoadingAlternatives(false));
    }
  }, [missing]);

  console.log("alt ingredients: ", alternatives);
  if (!missing) {
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

        {alternatives.map((alt, index) => (
            <button
            key={index}
            onClick={() => {
                setMissingIngred((prev) => prev.slice(1));
                console.log("missing after button click", missingIngred);
                setNewIngred((prev) => [...prev, `Substitute ${missing} with ${alt}`]);
                console.log("new after button click");

                console.log("Original ingredient list before button click", originalIngredientList)
                setOriginalIngredientList((prev) => [...prev, `${alt}`]);
                console.log("Original ingredient list after button click", originalIngredientList);
            }}
            >
            {alt}
            </button>
        ))}
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
    return extractIngredientNames(result.substitutes);
  } catch (error) {
    console.error(error);
    setLoadingAlternatives(false);
    return [];
  }
};

const extractIngredientNames = (substitutes) => {
  return substitutes.map((sub) => {
    // Remove measurements (e.g., "1 cup =", "1/2 tsp", "7/8 cup", etc.)
    return sub
      .replace(/(\d+\/\d+|\d+)\s*(cup|tsp|tbsp|oz|g|ml|lb|kg)?\s*=?\s*/gi, "")
      .trim();
  });
};

export default SubstitutionPopup;
