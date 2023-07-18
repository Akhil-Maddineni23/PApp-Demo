import React , { useState , useEffect } from 'react';
import { Link , useNavigate} from "react-router-dom";
import { useCookies } from "react-cookie";
import { useGetUserName } from "../hooks/useGetUserName"
import { useGetUserID } from "../hooks/useGetUserID";


export const Navbar =( {socket}) => {
    const [cookies, setCookies , removeCookie] = useCookies(['access_token']);
    const userName = useGetUserName();
    const navigate = useNavigate();
    const userID = useGetUserID();
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(socket){
            socket.on("getNotification", (data) => {
                setNotifications((prev) => [...prev, data]);
            });
        }
    }, [socket]);
    
    
    const logout = () => {
        setCookies("access_token" , "");
        window.sessionStorage.removeItem("userID");
        window.sessionStorage.removeItem("userName");
        removeCookie("access_token");
        navigate("/auth");
    }

    const displayNotification = ({ senderName, message } , index) => {
        return (
            <span className="notification" key={index}>{message} - <span style={{ color: 'blue' }}>{senderName}</span></span>
        );
    };

    const handleRead = () => {
        setNotifications([]);
        setOpen(false);
    };

    return (
        <div className="navbar">
            <Link to="/">Home</Link>
            {
                !userID ? 
                (<Link to="/auth">Login/Register</Link>) : (
                    <>
                    <Link to="/my-notes">My Notes</Link>
                    <span id="profile-username">👦🏻{userName}👩🏻‍🚀</span>
                    <div className="icon">
                        <button id="notification-bell" onClick={() => setOpen(!open)}>🔔</button>
                        {
                            notifications.length >0 &&
                            <div className="counter">{notifications.length}</div>
                        }
                    </div>
                    {open && notifications.length>0 && (
                        <div className="notifications">
                            {notifications.map((n , index) => displayNotification(n , index))}
                            {
                                notifications.length > 0 && (
                                    <button className="nButton" onClick={handleRead}>
                                        Mark All As Read
                                    </button>
                                )
                            }
                        </div>
                    )}
                    <button id='logout-button' onClick={logout}>LogOut</button>
                    </>
                )
            }
        </div>
    );
}