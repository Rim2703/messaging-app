import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import Room from "./components/Room/Room";
const App = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </React.Fragment>
  )
}

export default App;