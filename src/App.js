import React from "react";
import { Routes, Route } from "react-router-dom";

import Navigation from "./components/Navigation";
import Map from "./components/Map";
import Socket from "./components/socket";
import WeatherTable from "./components/WeatherTable";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";

function App() {
  return (
    <div>
      <header>
        <Navigation />
        <Routes>
          
          <Route path="*" element={<Map />}></Route>
          <Route path="/server" element={<Signup />}></Route>
          <Route path="/signup" element={<Socket />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/table" element={<WeatherTable />}></Route>
        </Routes>
      </header>
    </div>
  );
}

export default App;
