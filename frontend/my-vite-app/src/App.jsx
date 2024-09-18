import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Homes from "./pages/Home";
import Analytics from "./pages/Analytics";
import Content from "./pages/Content";
import Contact from "./pages/Contact";
import About from "./pages/About";
import MapView from "./MapView";
import { userData } from "./complete_userdetails";
import TrainersList from "./pages/TrainersList";
import TraineeList from "./pages/TraineeList";
import Ping from "./pages/pong"
import PeopleContainer from "./pages/search/PeopleContainer";

// function App() {
//   return (
//     <div>
//       <h1>Hello, Vite!</h1>
//     </div>
//   );
// }

// export default App;


const App = () => {
  return (
    <Router>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Homes />} />
          <Route path="/content" element={<Content />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/people" element={<People />} /> */}
          <Route path="/peoplecontainer" element={<PeopleContainer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/analytics/:aID" element={<Analytics />} />
          <Route path="/map" element={<MapView userData={userData} />} />
          <Route path="/trainers-list" element={<TrainersList />} />
          <Route path="/trainee-list" element={<TraineeList />} />
          <Route path="/ping" element={<Ping/>}/>
        </Routes>
      </RootLayout>
    </Router>
  );
};

export default App;
