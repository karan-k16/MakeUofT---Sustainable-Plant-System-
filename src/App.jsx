import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

import Session from "./components/Session";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Graph from "./components/Graph";
import SessionData from "./components/SessionData";

function App() {
  return (
    <div>
      <Navbar />

      <Session />
      <Graph />
      <SessionData />
      <About />
    </div>
  );
}

export default App;
