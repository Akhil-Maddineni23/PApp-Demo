import { BrowserRouter as Router , Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./components/Home";
import { Auth } from "./components/Auth";
import { MyNotes } from "./components/MyNotes";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
          <Routes>
            <Route path="/" element = {<Home />}  />
            <Route path="/auth" element = {<Auth />}  />
            <Route path="/my-notes" element = {<MyNotes />}  />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
