import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import About from "@/pages/About";
import Contact from "@/pages/Contact";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
