export const useGetUserName = () => {
    return window.sessionStorage.getItem("userName");
};