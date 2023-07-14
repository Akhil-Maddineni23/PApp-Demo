import React, { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";

export const AddNote = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const [note, setNote] = useState({
    name: "",
    password: "",
    userID: userID,
  });
  const [userLoginedError , setUserLoginedError] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNote({ ...note, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(!userID){
      setUserLoginedError(true);
      setNote({
        name : "",
        password :""
      })
    }
    else{
      try {
        await axios.post("http://localhost:5000/notes", note, {
          headers: { Authorization: cookies.access_token },
        });
        alert("Note Created");
        setNote({
            name : "",
            password :""
          })
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="create-note">
      <h2>Create Password Note</h2>
      <form onSubmit={handleSubmit} >
        <div className="form-group">
          <label htmlFor="name">Account Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={note.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="text"
            id="password"
            name="password"
            value={note.password}
            onChange={handleChange}
          />
        </div>
        { userLoginedError && <span id="note-error"> Please Login to create Note!..</span>}
        <button type="submit">Add Note</button>
      </form>
    </div>
  );
};
