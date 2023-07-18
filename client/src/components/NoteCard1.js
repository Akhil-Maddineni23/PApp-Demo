import React , {useState , useEffect}  from 'react';

export const NoteCard1 = ( { note }) => {
    const duration = note.expiresIn;
    const [remainingTime, setRemainingTime] = useState(duration);

    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    // Update the remaining time every second
    useEffect(() => {
        const interval = setInterval(() => {
          setRemainingTime((prevTime) => prevTime - 1);
        }, 1000);
    
        return () => {
          clearInterval(interval);
        };
    }, []);

    if(hours > 0 || minutes >0 || seconds>0 ){
        return(
            <div className='noteCard'>
                <p id='shared-note-head'>Shared By - <span id='shared-note-sharedBy'>{note.sharedBy}</span></p>
                <p id='account-name'>{note.name}</p>
                <label>Password :</label>
                <p><span id='timer-labels'>Expires In : H : M : S  : :  </span>
                <span id = 'timer-display'>{hours} : {minutes} : {seconds}</span></p>
                <p>{note.password}</p>
            </div>
        )
    }
    else{
        <p></p>
    }
}