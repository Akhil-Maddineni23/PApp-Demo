import React , { useState , useEffect } from 'react';
import axios from "axios";
import { useGetUserName } from "../hooks/useGetUserName"

export const NoteCard = ( { note , setAllNotes , fetchAllNodes , setCookie , cookies , removeCookie }) => {

  //const [cookie , setCookie ] = useState(['shared-note']);
  const userName = useGetUserName();
  const [ isRename , setIsRename] = useState(false);
  const [ isShare , setIsShare ] = useState(false);
  const [ newPassword , setNewPassword] = useState(note.password);
  const [ receiverEmail , setReceiverEmail] = useState("");
  const [ emailError , setEmailError ]= useState(false);
  const [ emailErrorMessage , setEmailErrorMessage ] = useState("");
  const [ receiverToken , setReveiverToken] = useState(null);

  const handleRename = (e) => {
    e.stopPropagation();
    setIsRename(true);
  }

  const handleShare = (e) => {
    e.stopPropagation();
    setIsShare(true);
  }

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {

      //Delete the cookie
      const cookieName = `shared-note-${note._id}`;
      //console.log("Cookie Name to be Deleted = ",cookieName);
      removeCookie(cookieName);

      await axios.delete(`http://localhost:5000/notes/${note._id}`);
      const response = fetchAllNodes();
      setAllNotes(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handlePasswordChange = async (e) => {
    // Enter Key
    e.stopPropagation();
    if(e.keyCode === 13 && e.target.value ){
      setIsRename(false);
      try {
        //Rename the password in the cookie too if that cookies is present
        const cookieName = `shared-note-${note._id}`;
        if(cookies[cookieName]){
          const cookie = cookies[cookieName];
          cookie.password = newPassword;
          setCookie(cookieName , cookie);
        }
        await axios.post(`http://localhost:5000/notes/${note._id}`, {password : newPassword});
        const response = fetchAllNodes();
        setAllNotes(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    if(receiverToken){
      note['token'] = receiverToken;
      note['sharedBy'] = userName;
      //Expires in - 20 Minutes
      //const timestamp = new Date().getTime();
      const variable = `shared-note-${note._id}`;

      // Set expiration to 2 hours - 2 * 60 * 60 * 1000
      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + 20 * 60 * 1000); //20 minutes

      note['expires'] = expirationDate;
      const sharedNote = JSON.stringify(note);
      
      setCookie(variable , sharedNote , { expires: expirationDate } );
      //console.log("Cookie created = ", cookies[variable]);
    }
  },[receiverToken]);
  
  const isValidEmail = email => {
    // Basic email validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailExistsOnServer = async (email) => {
    // Replace this with your actual API call or database query
    try {
      const response = await axios.post("http://localhost:5000/auth/emailcheck", {
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

  const handleEmailSubmit = async (e) => {
    e.stopPropagation();
    // Enter Key
    if(e.keyCode === 13){
      if(!receiverEmail.trim()){
        setEmailErrorMessage("Email Required");
        setEmailError(true);
      }
      else if(!isValidEmail(receiverEmail)){
        setEmailErrorMessage("Invalid Email Address");
        setEmailError(true);
      }else{
        // Now check this email exists or Not
        const response = await checkEmailExistsOnServer(receiverEmail);
        if(response){
          //If Email exists now share the data to the user
          setIsShare(false);
          try{
            const response = await axios.post("http://localhost:5000/auth/users", {email : receiverEmail});
            setReveiverToken(response.data.token);
            setReceiverEmail("");
            setEmailErrorMessage("");
          }catch (error) {
            console.error(error);
          }
        }
        else{
          setEmailErrorMessage("No user with this Email");
          setEmailError(true);
        }
      } 
    } 
  };
 
  return (
    <div className='noteCard'>
        <p id='account-name'>{note.name}</p>
        <label>Password :</label>
        {
          isRename ? 
          <input 
            type='text' 
            value = {newPassword}
            onKeyDown= { handlePasswordChange }
            onChange={ (event) => setNewPassword(event.target.value)}
          >
          </input> : <p>{note.password}</p>
        }
        { 
          isShare &&
          <div className='email-input'>
            <label>Receiver Email :</label>
            <input 
              type='text' 
              placeholder='Enter email of the Receiver'
              value = {receiverEmail}
              onKeyDown= { handleEmailSubmit }
              onChange={ (event) => setReceiverEmail(event.target.value)}
            >
            </input>
            {
            emailError && <span id='error'>{emailErrorMessage}</span>
            }
          </div>
        }
        
        <span className='buttons'>
        <button onClick={ (e) => handleRename(e) }>Rename</button>
        <button onClick={ (e) => handleDelete(e) }>Delete</button>
        <button onClick={ (e) => handleShare(e) }>Share</button>
        </span>
    </div>
  )
}
