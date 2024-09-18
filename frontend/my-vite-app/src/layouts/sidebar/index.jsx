
import ReactDOM from "react-dom/client";
import App from "../../App";
import { BrowserRouter } from "react-router-dom";

// Find the root element
const rootElement = document.getElementById('root');

// Create a root and render the app using createRoot
ReactDOM.createRoot(rootElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
