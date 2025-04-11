import '../App.css';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Link } from "react-router-dom";

function Home(props) {
  return (
    <div>
      <Title />
      <Buttons tutorialMode={props.tutorialMode} setTutorialMode={props.setTutorialMode} />
      <FlavorIcons />
    </div>
  );
}

function Title() {
  return (
    // todo change to center vertically in the box, or just have large upper paddning
    <div className="title-con">
      <h1 id="title-1">Welcome to</h1>
      <h1 id="title-2">Do Me A Flavor!</h1>
    </div>
  )
}

function Buttons(props) {
  return (
    <div className="buttons-con-outer">
      <div className="button-start-con">
        <Link to="/Ingredients">
          <button className="btn btn-primary button-start" >Let Me Cook!</button>
        </Link>
        <div>
          {/* <label>
            <input type="checkbox" checked={props.tutorialMode} onChange={() => props.setTutorialMode(!props.tutorialMode)}/>
            Tutorial Mode!
          </label> */}
        </div>
      </div>

      <div className=" buttons-con-inner">
        <div className=" justify-content-center">
          <button className="btn btn-primary" onClick={() => alert("Drafts feature coming soon!")}>
            Drafts
          </button>
        </div>
        <div className="justify-content-center ">
          <button className="btn btn-primary" onClick={() => alert("Cookbook feature coming soon!")}>
            Cookbook
          </button>
        </div>
        <div className="justify-content-center ">
          <button className="btn btn-primary" onClick={() => alert("Help feature coming soon!")}>
            Help
          </button>
        </div>
      </div>

    

    </div>
  )
}

const flavors = [
  "spicy", 
  "sweet", 
  "rich", 
  "sour", 
  "salty", 
  "bitter", 
  "umami"
];

function FlavorIcons() {
  return (
    <div className="flavor-icons-con">
      {flavors.map((flavor, index) => (
        <img key={index} src={`./images/icon_${flavor}.svg`} alt={`${flavor} icon`} className="flavor-icon" />
      ))}
    </div>
  )
}

export default Home;
