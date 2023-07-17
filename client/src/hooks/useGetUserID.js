export const useGetUserID = () => {
    return window.sessionStorage.getItem("userID");
};