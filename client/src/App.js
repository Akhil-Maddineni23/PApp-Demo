import React, {useState , useEffect} from 'react';
import { BrowserRouter as Router , Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./components/Home";
import { Auth } from "./components/Auth";
import { MyNotes } from "./components/MyNotes";
import { Navbar } from "./components/Navbar";
import { io } from "socket.io-client";

function App() {

  const [socket, setSocket] = useState(null);

  useEffect(() => {
      setSocket(io("http://localhost:5000"));
  }, []);

  return (
    <div className="App">
      <Router>
        <Navbar socket={socket} />
          <Routes>
            <Route path="/" element = {<Home />}  />
            <Route path="/auth" element = {<Auth />}  />
            <Route path="/my-notes" element = {<MyNotes socket = {socket}  />}  />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
