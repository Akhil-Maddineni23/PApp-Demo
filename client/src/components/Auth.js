import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetBaseURL } from "../hooks/useGetBaseURL";

export const Auth = () => {
  
  return (
    <div className="auth">
      <Login />
      <Register />
    </div>
  );
};

const Login = () => {
  const baseUrl = useGetBaseURL();
  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loginError , setLoginError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(loginData);
    if (Object.keys(validationErrors).length === 0) {
      // Login is valid, perform login logic here
      try{
        const response = await axios.post(`${baseUrl}/auth/login`, {
          email : loginData.email,
          password : loginData.password,
        });
        const data = await response.data;
        if(data.status){
          setCookies("access_token", response.data.token);
          window.sessionStorage.setItem("userID", response.data.userID);
          window.sessionStorage.setItem("userName", response.data.userName);
          //alert("Login Successfull !..");
          /*
          toast.success('😁Logined Successfully !..', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
          */
          navigate("/");
        }else{
          setLoginError(true);
        }
        
      }catch(err){
        console.log(err);
      }
      //console.log('Login successful!');

      // Clear form fields
      setLoginData({
        email: '',
        password: ''
      });
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(data.email)) {
      errors.email = 'Invalid email address';
    }

    if (!data.password.trim()) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const isValidEmail = (email) => {
    // Basic email validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
      <h2>Login</h2>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="loginemail"
              name="email"
              value={loginData.email}
              onChange={handleChange}
            />
            {errors.email && <span>{errors.email}</span>}
            {loginError && <span>Invalid Email or Password</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="loginpassword"
              name="password"
              value={loginData.password}
              onChange={handleChange}
            />
            {errors.password && <span>{errors.password}</span>}
            {loginError && <span>Invalid Email or Password</span>}
          </div>
          <button type="submit">Login</button>
      </form>   
      <ToastContainer />
    </div>
  );
};

const Register = () => {
  const baseUrl = useGetBaseURL();
  const [registrationData, setRegistrationData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [emailExists, setEmailExists] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm(registrationData);

    if (Object.keys(validationErrors).length === 0 && !emailExists) {
      // Registration is valid, perform registration logic here
      try{
        const response = await axios.post(`${baseUrl}/auth/register`, {
          email : registrationData.email,
          password : registrationData.password,
          username : registrationData.username
        });
        //alert('Registration successful!');
        toast.success('😁Registered Successfully !..', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
      }catch(err){
        console.log(err);
      }

      // Clear form fields
      setRegistrationData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = data => {
    const errors = {};

    if (!data.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(data.email)) {
      errors.email = 'Invalid email address';
    }

    if (!data.password.trim()) {
      errors.password = 'Password is required';
    } else if (data.password.length < 6) {
      errors.password = 'Password should be at least 6 characters long';
    }

    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const isValidEmail = email => {
    // Basic email validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailExistsOnServer = async email => {
    // Replace this with your actual API call or database query
    try {
      const response = await axios.post(`${baseUrl}/auth/emailcheck`, {
        email
      });
      const data = await response.data;
      //console.log("Data = " , data);
      return data.exists;
    } catch (error) {
      console.error('Error checking email on the server:', error);
      return false;
    }
  };

  const handleEmailBlur = async () => {
    if (registrationData.email.trim()) {
      const emailExists = await checkEmailExistsOnServer(registrationData.email);
      setEmailExists(emailExists);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={registrationData.username}
            onChange={handleChange}
          />
          {errors.username && <span>{errors.username}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email2"
            name="email"
            value={registrationData.email}
            onChange={handleChange}
            onBlur={handleEmailBlur}
          />
          {errors.email && <span>{errors.email}</span>}
          {emailExists && <span>Email already registered</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="regpassword"
            name="password"
            value={registrationData.password}
            onChange={handleChange}
          />
          {errors.password && <span>{errors.password}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="confirmpassword">Confirm Password:</label>
          <input
            type="password"
            id="regconfirmpassword"
            name="confirmPassword"
            value={registrationData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
        </div>
        <button type="submit">Register</button>
      </form>
      <ToastContainer />
    </div>
  );
};