export const updateCookie = (cookies , noteID , newPassword) => {
    //const regex = new RegExp(`^shared-note-${userID}`);
    const cookieName = `^shared-note-${noteID}`
    cookies[cookieName].password = newPassword;
};