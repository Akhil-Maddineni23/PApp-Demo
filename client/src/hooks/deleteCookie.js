export const deleteCookie = (noteID , removeCookie) => {
    //const regex = new RegExp(`^shared-note-${userID}`);
    //Delete the cookie
    const cookieName = `shared-note-${note._id}`;
    console.log("Cookie Name to be Deleted = ",cookieName);
    removeCookie(cookieName);
};