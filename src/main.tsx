import React from "react";
import ReactDOM from "react-dom/client";
import App from "./routes/App";
import { BrowserRouter } from "react-router-dom";
import ReactQueryProvider from "./Provider/ReactQueryProvider";
import '../src/index.css';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ReactQueryProvider>
        <App />
        <Analytics />
        <SpeedInsights />
      </ReactQueryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
