import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "../src/Pages/SignIn";
import Register from "../src/Pages/Register";
import PrivateRoute from "./Components/PrivateRoutes";
import OwnerSelectSociety from "./Pages/OwnerSelectSociety";
import OwnerAddFlats from "./Pages/AddFlats";

import Dashboard from "./Components/User/Dashboard";

export default function App() {

  return (


      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<Register />} />

        {/* owner */}

        <Route path="/owner/select-society" element={<PrivateRoute> <OwnerSelectSociety /> </PrivateRoute>} />
        <Route path="/owner/add-flats" element={<PrivateRoute> <OwnerAddFlats /> </PrivateRoute>} />
        <Route path="/owner/dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute>} />
      </Routes>

  );
}