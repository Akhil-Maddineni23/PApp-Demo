import { Link , useNavigate} from "react-router-dom";
import { useCookies } from "react-cookie";


export const Navbar =() => {
    const [cookies, setCookies] = useCookies(['access_token']);
    const navigate = useNavigate();

    const logout = () => {
        setCookies("access_token" , "");
        window.sessionStorage.removeItem("userID");
        navigate("/auth");
    }
    return (
        <div className="navbar">
            <Link to="/">Home</Link>
            <Link to="/add-note">Add Note</Link>
            {
                !cookies.access_token ? 
                (<Link to="/auth">Login/Register</Link>) : (
                    <>
                    <Link to="/all-notes">Saved Notes</Link>
                    <button onClick={logout}>LogOut</button>
                    </>
                )
            }
        </div>
    );
}