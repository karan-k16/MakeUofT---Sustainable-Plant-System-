import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Hero from "./components/Hero";
import Session from "./components/Session";
import Navbar from "./components/Navbar";
import About from "./components/About";

function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      {/* <Session /> */}
    </div>
  );
}

export default App;
