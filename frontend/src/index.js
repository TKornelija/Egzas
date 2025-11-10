import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { I18nProvider } from "./lib/i18n";
import { AuthContextProvider } from "./context/authContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import "./assets/fonts/fonts.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <I18nProvider>
      <BrowserRouter>
        <AdminAuthProvider>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </AdminAuthProvider>
      </BrowserRouter>
    </I18nProvider>
  </React.StrictMode>
);