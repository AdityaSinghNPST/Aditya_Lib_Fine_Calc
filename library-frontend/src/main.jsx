import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.jsx";


/*
 * Find the HTML element with:
 *
 * <div id="root"></div>
 *
 * inside index.html.
 */
const rootElement =
    document.getElementById("root");


/*
 * Start the React application.
 *
 * App contains:
 *
 * BrowserRouter
 *      ↓
 * AuthProvider
 *      ↓
 * Routes
 *      ↓
 * Pages
 */
createRoot(rootElement).render(

    <StrictMode>

        <App />

    </StrictMode>
);