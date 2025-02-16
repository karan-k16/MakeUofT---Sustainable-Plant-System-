import React from "react";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const Session = () => {
  const [growthData, setGrowthData] = useState({
    days: [],
    height: [],
    final_day: null,
  });

  useEffect(() => {
    const fetchGrowthData = async () => {
      const response = await fetch("http://127.0.0.1:5000/growth_data");
      const data = await response.json();
      setGrowthData(data);
    };

    fetchGrowthData();
    const interval = setInterval(fetchGrowthData, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <h1>Plant Growth Tracker</h1>
      <img
        src="http://127.0.0.1:5000/video_feed"
        width="640"
        height="480"
        alt="Live Feed"
      />

      <h2>Growth Prediction</h2>
      {growthData.final_day && (
        <p>
          Estimated Final Growth Day:{" "}
          <strong>{growthData.final_day.toFixed(2)}</strong>
        </p>
      )}

      <Plot
        data={[
          {
            x: growthData.days,
            y: growthData.height,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "blue" },
          },
        ]}
        layout={{
          title: "Plant Growth Over Time",
          xaxis: { title: "Days" },
          yaxis: { title: "Height (px)" },
        }}
        style={{ width: "100%", height: "400px" }}
      />
    </div>
  );
};

export default Session;
