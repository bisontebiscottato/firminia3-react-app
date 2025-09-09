import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import I18nProvider from "./components/I18nProvider";
import "./styles/globals.css";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
