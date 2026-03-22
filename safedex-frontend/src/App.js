import "./App.css";
import AppLayout from "./layout/Layout";
import Content from "./Content";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout>
          <Content />
        </AppLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
