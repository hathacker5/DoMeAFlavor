import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header.js";

function Flavor() {
  return (
    <div className="container">
      <Header />

      <SingleFlavor name="Spicy" />
    </div>
  );
}

const SingleFlavor = ({ name, image }) => {
  return (
    <div>
      <div className="row">
        <div className="col-3">Pic</div>

        <div className="col-9">
          <div className="row"><p>Spicy</p></div>
          <div className="row">
            <p>
                Slider bar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flavor;
