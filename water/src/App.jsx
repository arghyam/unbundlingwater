import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Homes from "./pages/Home";
import Analytics from "./pages/Analytics";
import Content from "./pages/Content";
import Contact from "./pages/Contact";
import People from "./pages/People";
import About from "./pages/About";
import MapView from "./MapView";
import { userData } from "./complete_userdetails";
import TrainersList from "./pages/TrainersList";
import TraineeList from "./pages/TraineeList";

const App = () => {
  return (
    <Router>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Homes />} />
          <Route path="/content" element={<Content />} />
          <Route path="/about" element={<About />} />
          <Route path="/people" element={<People />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/analytics/:aID" element={<Analytics />} />
          <Route path="/map" element={<MapView userData={userData} />} />
          <Route path="/trainers-list" element={<TrainersList />} />
          <Route path="/trainee-list" element={<TraineeList />} />
        </Routes>
      </RootLayout>
    </Router>
  );
};

export default App;
