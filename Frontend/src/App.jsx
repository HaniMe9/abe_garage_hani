import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Contexts/AuthContext";
import AppRoutes from "./routes/routes";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fontsource/inter";
import "./App.css";

const App = () => (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
);

export default App;
