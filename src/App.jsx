import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Hero from "./components/hero";
import Session from "./components/Session";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Graph from "./components/Graph";

function App() {
  return (
    <div>
      <Navbar />

      <Session />
      <Graph />
    </div>
  );
}

export default App;
