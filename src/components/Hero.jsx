import React from "react";
import { useEffect, useState } from "react";

const Hero = () => {
  const [screen, setScreen] = useState("home");

  const startTracking = () => {
    setScreen("tracking");
  };
  return (
    <div className="flex flex-center justify-center items-center h-screen flex-col-1 gap-y-9 gap-x-36 select-none">
      <div className="relative">
        <p className="absolute top-2 left-2 text-[40rem] text-green-700 rotate-45">
          ?
        </p>
        <p className="text-[40rem] text-green-600 rotate-45">?</p>
      </div>

      <div className="flex flex-col items-center gap-y-5">
        
        <button
          className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg shadow-md border-b-4 border-green-600"
          onClick={startTracking}
        >
          Start Tracking
        </button>
      </div>
    </div>
  );
};

export default Hero;
