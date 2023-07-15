import { Link , useNavigate} from "react-router-dom";
import { useCookies } from "react-cookie";
import { useGetUserName } from "../hooks/useGetUserName"
import { useGetUserID } from "../hooks/useGetUserID";


export const Navbar =() => {
    const [cookies, setCookies , removeCookie] = useCookies(['access_token']);
    const userName = useGetUserName();
    const navigate = useNavigate();
    const userID = useGetUserID();

    const logout = () => {
        setCookies("access_token" , "");
        window.sessionStorage.removeItem("userID");
        window.sessionStorage.removeItem("userName");
        removeCookie("access_token");
        navigate("/auth");
    }
    return (
        <div className="navbar">
            <Link to="/">Home</Link>
            {
                !userID ? 
                (<Link to="/auth">Login/Register</Link>) : (
                    <>
                    <Link to="/my-notes">My Notes</Link>
                    <span id="profile-username">👦🏻{userName}👩🏻‍🚀</span>
                    <button onClick={logout}>LogOut</button>
                    </>
                )
            }
        </div>
    );
}
