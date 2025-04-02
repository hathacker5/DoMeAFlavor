import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Outlet, Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <Title />
      <Buttons />
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

function Buttons() {
  return (
    <div className="buttons-con-outer">
      <Link to="/Ingredients">
        <button>Let Me Cook!</button>
      </Link>

      {/* fix: implement and remove 'disabled' */}
      <div className="row buttons-con-inner">
        <div className="col-4 justify-content-center">
          <button className="btn btn-primary" disabled>
            Drafts
          </button>
        </div>
        <div className="col-4 justify-content-center ">
          <button className="btn btn-primary" disabled>
            Cookbook
          </button>
        </div>
        <div className="col-4 justify-content-center ">
          <button className="btn btn-primary" disabled>
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

