import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import CreateSociety from "./components/admins/CreateSociety";
import CreateFlat from "./components/admins/CreateFlat";
import DisplaySociety from "./components/admins/DisplaySociety";
import DisplayFlat from "./components/admins/DisplayFlat";
import DisplayOwner from "./components/admins/DisplayOwner";

const App = () => {
  return (
    <div className="min-h-screen bg-black">

    {/* admin */}
      <Navbar />

      <Routes>
        <Route path="/" element={<DisplaySociety />} />

        <Route path="/createsociety" element={<CreateSociety />} />

        <Route path="/createFlats/:name/:id" element={<CreateFlat />} />

        <Route path="/displayflats/:id" element={<DisplayFlat />} />

        <Route path="/ownerDetails/:id" element={<DisplayOwner />} />
        
      </Routes> 

    {/* owner */}
    

    </div>
  );
};

export default App;