import React, { useState } from "react";

const Session = () => {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = async () => {
    try {
      if (!isRecording) {
        // Start recording
        const response = await fetch("http://127.0.0.1:5000/start_recording", {
          method: "POST",
        });
        const data = await response.json();
        console.log(data.message);
      } else {
        // Stop recording
        const response = await fetch("http://127.0.0.1:5000/stop_recording", {
          method: "POST",
        });
        const data = await response.json();
        console.log(data.message);
      }

      // Toggle the recording state
      setIsRecording((prevState) => !prevState);
    } catch (error) {
      console.error("Error toggling recording:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col-2 lg:mx-72 justify-between items-center" href="#session">
      <div className="shadow-2xl relative">
        <div className="absolute bg-red-700 h-10 w-10 rounded-full top-6 left-10 animate-pulse -translate-x-1/2 z-10 text-white" />
        <img
          src="http://127.0.0.1:5000/video_feed"
          width="800"
          height="600"
          alt="Live Feed"
          className="z-0 rounded-2xl border border-"
        />
      </div>
      <div className="flex flex-col items-center gap-y-5">
        <h1 className="text-4xl  text-zinc-800   ">
          What are you doing plant!
        </h1>
        <button
          onClick={toggleRecording}
          className={
            isRecording
              ? "bg-red-500 text-white py-2 px-6 rounded-lg shadow-md border-b-4 border-red-600"
              : "bg-green-500 text-white py-2 px-6 rounded-lg shadow-md border-b-4 border-green-600"
          }
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
    </div>
  );
};

export default Session;
