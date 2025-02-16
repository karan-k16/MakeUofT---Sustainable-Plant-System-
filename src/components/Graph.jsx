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

        const newTableData = data.days.map((day, index) => ({
          Timestamp: new Date(
            Date.now() - data.days.length * 86400000
          ).toISOString(),
          "Plant Height (cm)": data.height[index].toFixed(2),
        }));

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
      className="flex flex-col items-center justify-between  py-10 "
      href="#graph"
    >
      <h2 className="text-3xl font-bold text-green-700">
        Plant Growth Over Time (cm)
      </h2>

      <div className="flex flex-col-2 items-center justify-between gap-x-8">
        <div className="flex flex-col items-center ">
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
          <table className="table-auto border-collapse ">
            <thead>
              <tr className="bg-green-700 text-white">
                <th className=" px-8  py-2">Timestamp</th>
                <th className=" px-8  py-2">Plant Height (cm)</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td className=" px-24 py-2">{row.Timestamp}</td>
                  <td className=" px-24 py-2 justify-center flex">
                    {row["Plant Height (cm)"]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Graph;
