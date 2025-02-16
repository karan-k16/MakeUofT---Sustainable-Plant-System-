import React, { useEffect, useState } from "react";
import Papa from "papaparse";

const SessionData = () => {
  const [data, setData] = useState([]);

  const fetchData = () => {
    fetch("../server/sensor_data.csv")
      .then((response) => response.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: true, // Convert rows into JSON format
          dynamicTyping: true, // Convert numbers automatically
          complete: (result) => setData(result.data.reverse()), // Reverse order to show most recent entries first
        });
      })
      .catch((error) => console.error("Error fetching CSV:", error));
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Refresh every 5s

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="bg-white rounded-lg mx-72 my-8 flex flex-col rounded-2xl md:flex-row items-center justify-center gap-16">
      <div className="w-full h-1/2 p-4 shadow-lg flex justify-center items-center flex-col rounded-2xl">
        <h2 className="text-3xl font-bold text-green-700 mb-4">
          Current Stats
        </h2>

        {/* Added a div wrapper with a fixed height and scrollbar */}
        <div className="w-full max-h-96 overflow-y-auto border border-gray-300 rounded-lg">
          <table className="w-full text-center border border-gray-300">
            <thead>
              <tr className="bg-green-700 text-white">
                <th className="p-2">Timestamp</th>
                <th className="p-2">Humidity</th>
                <th className="p-2">Temperature</th>
                <th className="p-2">Soil Moisture</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{row.Timestamp}</td>
                  <td className="p-2">{row.Humidity}</td>
                  <td className="p-2">{row.Temperature}</td>
                  <td className="p-2">{row["Soil Moisture"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SessionData;
