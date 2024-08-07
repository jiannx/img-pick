import ReactDOM from "react-dom/client";
import App from "./pages/App";
import "./globals.css";

// React.StrictMode 会导致刷新两次
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
