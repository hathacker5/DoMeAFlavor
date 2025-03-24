import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Header() {
  return (
    <div>
      <div className="row">
        <div className="col-1">Back</div>
        <div className="col-1">Home</div>
        <div className="col-9"></div>
        <div className="col-1">Next</div>
      </div>
      <div className="row">Customize Your</div>
      <div className="row">Flavor Profile</div>
      <div className="row"></div>
    </div>
  );
}

export default Header;
