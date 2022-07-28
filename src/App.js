import './App.css';
import BarChart from "./components/BarChart";
import Map from "./components/Map";
import { useState } from "react";
// import RacingBarChart from "./components/RacingBarChart";

function App() {
  const [data, setData] = useState([25, 30, 45, 60, 85, 65, 75]);

  return (
    <div class="everything">
      <div>
        <h1>Spaghetti Map.</h1>
      </div>
      <div className="container">
        <Map />
        <BarChart data={data} setData={setData} />
      </div>
    </div>
  );
}

export default App;
