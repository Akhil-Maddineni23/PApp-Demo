import React, { useState , useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  return (
    <div className="auth">
      <Login />
      <Register />
    </div>
  );
};

const Login = () => {
  const [_, setCookies] = useCookies(["access_token"]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status , setStatus] = useState("");
  const [response , setResponse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if(response){
      setStatus(response.data.status);
      if(status){
        setCookies("access_token", response.data.token);
        window.sessionStorage.setItem("userID", response.data.userID);
        alert("Login Successfull !..");
        navigate("/");
      } 
    }
  }, [response]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    //event.stopPropagation();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      setResponse(res); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
      <h2>Login</h2>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email1"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            { status ===false && <span id="error">Incorrect Email or Password</span> }
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password1"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            { status ===false && <span id="error">Incorrect Email or Password</span> }
          </div>
          <button type="submit">Login</button>
      </form>   
    </div>
  );
};

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status , setStatus] = useState(true);
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/register", {
        email,
        password,
      });
      setStatus(response.data.status);

      if(status){
        alert(" Registration Successfully !.. Login Now !..");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email2"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          { !status ? <span id="error">Email ID - Already Exists</span> : <p></p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password2"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};