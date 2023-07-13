import React  from 'react';

export const NoteCard1 = ( { note }) => {
    if(note.expiresIn[0] > 0 || note.expiresIn[1] >0 || note.expiresIn[2] >0){
        return(
            <div className='noteCard'>
                <p id='account-name'>{note.name}</p>
                <label>Password :</label>
                <p><span id='timer-labels'>Expires In : H : M : S  : :  </span>
                <span id = 'timer-display'>{note.expiresIn[0]} : {note.expiresIn[1]} : {note.expiresIn[2]}</span></p>
                <p>{note.password}</p>
            </div>
        )
    }
    else{
        <p></p>
    }
    
}