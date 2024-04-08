import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Socket = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:3001"); // Replace with your server URL

    // Handle connection
    socket.on("connect", () => {
      setLogs((prevLogs) => [...prevLogs, "Connected to server"]);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      setLogs((prevLogs) => [...prevLogs, "Disconnected from server"]);
    });

    // Handle messages from server
    socket.on("message", (message) => {
      setLogs((prevLogs) => [
        ...prevLogs,
        `Received message from server: ${message}`,
      ]);
    });

    // Clean up socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Console Logs</h1>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
};

export default Socket;
