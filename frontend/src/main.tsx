import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import axios from "axios";
import "./index.css";

// Set base URL for production. 
// In development, this stays empty to allow Vite proxy to handle '/api' requests.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";

createRoot(document.getElementById("root")!).render(<App />);
