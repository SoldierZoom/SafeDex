import "./App.css";
import AppLayout from "./layout/Layout";
import Content from "./Content";
import { BrowserRouter } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Content />
      </AppLayout>
    </BrowserRouter>
  );
}
