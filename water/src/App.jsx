import { Route, Routes } from "react-router-dom";
// import { BrowserRouter } from 'react-router-dom';
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import Content from "./pages/Content";
import Contact from "./pages/Contact";
import People from "./pages/People";
import About from "./pages/About";

const App = () => {
  return (
    <RootLayout>
       
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/content" element={<Content />} />
        <Route path="/about" element={<About />} />
        <Route path="/people" element={<People />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/analytics/:aID" element={<Analytics />} />
      </Routes>
    
    </RootLayout>
  );
};

export default App;