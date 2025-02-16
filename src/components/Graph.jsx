import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const Graph = () => {
  const [growthData, setGrowthData] = useState({
    days: [],
    height: [],
    final_day: null,
  });
  const [tableData, setTableData] = useState([]);

  const fetchGrowthData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/growth_data");
      const data = await response.json();
      if (data.days && data.height) {
        setGrowthData({
          days: data.days.map((d) => parseFloat(d)),
          height: data.height.map((h) => parseFloat(h)),
          final_day: data.final_day ? parseFloat(data.final_day) : null,
        });

        // Create new table data with most recent 7 entries
        const newTableData = data.days.map((day, index) => ({
          Timestamp: new Date(Date.now() - data.days.length * 86400000) // Approximate timestamp
            .toISOString(),
          "Plant Height (cm)": data.height[index].toFixed(2),
        }));

        // Keep only the last 7 records, fill empty rows if needed
        const filledTable = [...newTableData.slice(-7)];

        setTableData(filledTable);
      }
    } catch (error) {
      console.error("Error fetching growth data:", error);
    }
  };

  const clearData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/clear_data", {
        method: "POST",
      });
      const data = await response.json();
      console.log(data.message);

      // Clear table & graph data after reset
      setTableData(
        Array(7).fill({ Timestamp: "--", "Plant Height (cm)": "--" })
      );
      setGrowthData({ days: [], height: [], final_day: null });
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  useEffect(() => {
    fetchGrowthData();
    const interval = setInterval(fetchGrowthData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col-2 items-center justify-between  py-10 lg:mx-72"
      href="#graph"
    >
      <div className="flex flex-col items-center ">
        <h2>Plant Growth Over Time (cm)</h2>
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
            yaxis: { title: "Height (cm)" },
          }}
        />
        <button
          onClick={clearData}
          className="bg-red-500 text-white py-2 px-6 rounded-lg shadow-md border-b-4 border-red-600 mt-5"
        >
          Clear Data
        </button>
      </div>
      <div className="flex flex-col items-center ">
        <h2 className="">Recent Data (Last 7 Entries)</h2>
        <table className="table-auto border-collapse border border-gray-400">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="border border-gray-300 px-4 py-2">Timestamp</th>
              <th className="border border-gray-300 px-4 py-2">
                Plant Height (cm)
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  {row.Timestamp}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row["Plant Height (cm)"]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Graph;
