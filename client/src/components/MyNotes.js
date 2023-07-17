import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { NoteCard } from "./NoteCard";
import { NoteCard1 } from "./NoteCard1";
import { useCookies } from "react-cookie";
import {AddNote } from "./AddNote";

export const MyNotes = () => {

  const userID = useGetUserID();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [allNotes, setAllNotes] = useState([]);
  const [receivedNotes , setReceivedNotes] = useState([]);
  

  const fetchAllNotes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/notes/${userID}`
      );
      setAllNotes(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllNotes();
  }, [allNotes]);

  useEffect(() => {
    const regex = /^shared-note/;
    const fKeys = Object.keys(cookies).filter(cookie => regex.test(cookie));
    const filterKeys = fKeys.filter(key => cookies[key].receiverID === userID);
    //console.log("Filtered Keys = ", filterKeys);

    const makeRequests = async () => {
      try {
        const responses = await Promise.all(filterKeys.map(key => axios.get(`http://localhost:5000/auth/users/tokenverify` , 
        {
          headers: { Authorization: cookies[key].token },
        }
        )));

        const responseData = responses.map((response , index) => {
          if(response.data.status ){

            const getExpirationAge = (cookie) => {
              if (cookie && cookie.expires) {
                const expirationDate = new Date(cookie.expires);
                const now = new Date();
                const expirationAge = expirationDate.getTime() - now.getTime();
                // Convert the expiration age from milliseconds to seconds
                const totalSeconds = Math.floor(expirationAge / 1000);
               return totalSeconds 
              }
              return null;
            };
          
            return {
              id : cookies[filterKeys[index]]._id,
              name : cookies[filterKeys[index]].name,
              sharedBy : cookies[filterKeys[index]].sharedBy,
              expiresIn : getExpirationAge(cookies[filterKeys[index]]),
              password : cookies[filterKeys[index]].password
            }
          }
        });
        setReceivedNotes(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    makeRequests();
  }, []);

  return (
    <div className="mynotes">
     <AddNote />
      <div className="notes" >
        { allNotes.length > 0 && (
          <ul className="allNotes">
            {allNotes.map((note) => (
              <NoteCard 
                note={note} 
                key={note._id} 
                cookies = {cookies}
                setCookie = {setCookie}
                removeCookie = {removeCookie}
                setAllNotes = {setAllNotes}
                fetchAllNotes = {fetchAllNotes}
              />
            ))}
          </ul>
        ) }
      </div>
      <div className="notes">
          {receivedNotes.length > 0 && (
            <ul className="allNotes">
              {receivedNotes.map((note , index) => (
                <NoteCard1 
                  note={note} 
                  key={index} 
                />
              ))}
            </ul>
          ) }
      </div>
    </div>
  );
};


/*
<h1 className="saved-notes-head">My Password Notes</h1>
<h1 className="saved-notes-head" >Received Password Notes</h1>
*/