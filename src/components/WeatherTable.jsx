import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "../styles/WeatherTable.css";

const WeatherTable = () => {
  const [featureData, setFeatureData] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:3001"); // Replace with your server URL

    // Listen for initial feature data
    socket.on("INIT_WEATHER", (initialData) => {
      setFeatureData(initialData);
    });

    // Listen for updates to feature data
    socket.on("UPDATE_WEATHER", (newData) => {
      setFeatureData((prevData) => {
        // Update existing data with new data
        const updatedData = prevData.map((item) => {
          if (item._id === newData._id) {
            return newData;
          }
          return item;
        });

        // If the new data doesn't exist in the previous data, add it
        if (!updatedData.find((item) => item._id === newData._id)) {
          updatedData.push(newData);
        }

        return updatedData;
      });
    });

    // Clean up socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Real-time Geographic Data</h1>

      <table striped="columns">
        <thead>
          <tr>
            <th>Station</th>
            <th>Description</th>
            <th>Temperature (°C)</th>
            <th>Humidity (%)</th>
            <th>Air Pressure</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(featureData) &&
            featureData.map((data) => (
              <tr key={data._id}>
                <td>{data.properties.station}</td>
                <td>{data.properties.description}</td>
                <td>{data.properties.temperature}</td>
                <td>{data.properties.humidity}</td>
                <td>{data.properties.airPressure}</td>
                <td>
                  <p>Coordinates: {data.geometry.coordinates.join(", ")}</p>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeatherTable;
