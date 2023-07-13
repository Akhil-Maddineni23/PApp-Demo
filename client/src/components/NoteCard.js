import React , { useState , useEffect } from 'react';
import axios from "axios";
//import { deleteCookie } from '../hooks/deleteCookie';

export const NoteCard = ( { note , setAllNotes , fetchAllNodes , setCookie , cookies , removeCookie }) => {

  //const [cookie , setCookie ] = useState(['shared-note']);
  
  const [ isRename , setIsRename] = useState(false);
  const [ isShare , setIsShare ] = useState(false);
  const [ newPassword , setNewPassword] = useState(note.password);
  const [ receiverEmail , setReceiverEmail] = useState("");
  const [receiverToken , setReveiverToken] = useState(null);

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
      console.log("Cookie Name to be Deleted = ",cookieName);
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
    
    if(e.keyCode === 13 && e.target.value ){
      setIsRename(false);
      try {

        //Rename the password in the cookie too
        const cookieName = `shared-note-${note._id}`;
        /*
        console.log("Type of Cookies = ", typeof(cookies));
        console.log("Type of cookie inside = " , typeof(cookies[cookieName]));
        console.log("All Cookies = " , cookies);
        console.log("Cookie = " , cookies[cookieName]);
        setCookie((prev) => ({
          ...prev,
          [cookieName] : { ...prev[cookieName] , password : newPassword}
        }))
        */
        const cookie = cookies[cookieName];
        cookie.password = newPassword;
        setCookie(cookieName , cookie);

        await axios.post(`http://localhost:5000/notes/${note._id}`, {password : newPassword});
        const response = fetchAllNodes ();
        setAllNotes(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    if(receiverToken){
      note['token'] = receiverToken;
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

  const handleEmailSubmit = async (e) => {
    // Enter Key
    if(e.keyCode === 13 && e.target.value ){
      setIsShare(false);
      try{
        const response = await axios.post("http://localhost:5000/auth/users", {email : receiverEmail});
        setReveiverToken(response.data.token);
      }catch (error) {
        console.error(error);
      }
    } 
  }
 
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
          isShare ?
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
          </div> : <p></p>
        }
        <span className='buttons'>
        <button onClick={ (e) => handleRename(e) }>Rename</button>
        <button onClick={ (e) => handleDelete(e) }>Delete</button>
        <button onClick={ (e) => handleShare(e) }>Share</button>
        </span>
    </div>
  )
}

