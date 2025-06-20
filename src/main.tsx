import React from "react";
import ReactDOM from "react-dom/client";
import App from "./routes/App";
import { BrowserRouter } from "react-router-dom";
import ReactQueryProvider from "./Provider/ReactQueryProvider";
import '../src/index.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter> 
    <ReactQueryProvider>
      <App />
      </ReactQueryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
