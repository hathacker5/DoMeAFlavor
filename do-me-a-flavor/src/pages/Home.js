import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 

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
      <button 
          className="btn btn-primary"
      >
        Let Me Cook!
      </button>

      <div className="row buttons-con-inner">
        <div className="col-4 justify-content-center">
          <button className="btn btn-primary">
            Drafts
          </button>
        </div>
        <div className="col-4 justify-content-center ">
          <button className="btn btn-primary">
            Cookbook
          </button>
        </div>
        <div className="col-4 justify-content-center ">
          <button className="btn btn-primary">
            Help
          </button>
        </div>
      </div>

    </div>
  )
}

function FlavorIcons() {
  return (
    // plan: have them in a line, and wrap them.
    <div className="flavor-icons-con"> 
      <p>in flavor icons</p>
    </div>
  )
}

export default Home;
