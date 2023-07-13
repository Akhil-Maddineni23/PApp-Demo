import { BrowserRouter as Router , Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/home";
import { Auth } from "./pages/auth";
import { PasswordNote } from "./pages/password-note";
import { AllNotes } from "./pages/all-notes";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
          <Routes>
            <Route path="/" element = {<Home />}  />
            <Route path="/auth" element = {<Auth />}  />
            <Route path="/add-note" element = {<PasswordNote />}  />
            <Route path="/all-notes" element = {<AllNotes />}  />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
