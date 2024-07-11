import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavMentee.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faPlaceOfWorship,
    faUserGraduate,
    faCommentDots,
    faEnvelope,
    faChevronDown,
    faChevronUp,
    faRightFromBracket,
    faToolbox,
    faA,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/logo/logo-tote.png";
import altImg from "../../assets/image/noImage.png";
import {
    fetchAPIMyProfile,
    getUnreadNoti,
    logout,
    updateReadNoti,
} from "../../services/service";
import { RYI_URL } from "../../URL_BE/urlbackend";
import * as signalR from "@microsoft/signalr";

// const backendURL = process.env.REACT_APP_API_URL;
const backendURL = "https://totevn.azurewebsites.net";

export default function NavMentee({ activePage }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const [myProfile, setMyProfile] = useState({});
    const [noti, setNoti] = useState(0);

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${backendURL}/notificationhub`)
            .build();

        connection.on("ReceiveNotification", (message) => {
            setNotifications((prevNotifications) => [...prevNotifications, message]);
            setNoti((n) => n + 1);
        });

        connection
            .start()
            .catch((err) => console.error("Connection failed: ", err));

        return () => {
            connection.stop();
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleProfileSetting = () => {
        navigate("/my-profile"); // Change this path to your profile setting route
    };

    const fetchAPI = () => {
        fetchAPIMyProfile()
            .then((response) => {
                console.log(response);
                const data = response.data.data;
                setMyProfile(data);
            })
            .catch((error) => {
                console.error("There was an error fetching profile data!", error);
            });
    };

    const fetchNotifications = () => {
        getUnreadNoti()
            .then((res) => {
                console.log("unread", res);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleLogout = () => {
        logout()
            .then((response) => {
                console.log("Logout successful:", response);
                navigate("/signin"); // Redirect to the login page after logout
                // Delete the token cookie
                document.cookie =
                    "token=; path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure";
                // Clear local storage role
                localStorage.removeItem("role");
                localStorage.removeItem("token");
            })
            .catch((error) => {
                console.error("Logout error:", error);
            });
    };

    useEffect(() => {
        fetchAPI();
        fetchNotifications();
    }, []);

    const handleClickNoti = () => {
        setNoti(0);
        updateReadNoti()
            .then((res) => {
                console.log("update noti", res);
            })
            .catch((err) => {
                console.log(err);
            });
        fetchNotifications();
    };

    return (
        <>
            <div className="mentee-nav-mentee-container">
                <Link className="mentee-nav-item" to="/mentee-homepage">
                    <img className="mentee-logo-tote" src={logo} alt="Logo Tote" />
                </Link>
                <nav className="mentee-nav-items">
                    <Link
                        className={`mentee-nav-item ${activePage === "home" ? "mentee-active-page" : ""}`}
                        to="/mentee-homepage"
                    >
                        <FontAwesomeIcon icon={faHouse} />
                        <div>Home</div>
                    </Link>
                    <Link
                        className={`mentee-nav-item ${activePage === "workspace" ? "mentee-active-page" : ""}`}
                        to="/mentee-workspace"
                    >
                        <FontAwesomeIcon icon={faPlaceOfWorship} />
                        <div>My Workspace</div>
                    </Link>
                    <Link
                        className={`mentee-nav-item ${activePage === "application" ? "mentee-active-page" : ""}`}
                        to="/mentee/application"
                    >
                        <FontAwesomeIcon icon={faA} />
                        <div>Application</div>
                    </Link>
                    <Link
                        className={`mentee-nav-item ${activePage === "mentors" ? "mentee-active-page" : ""}`}
                        to="/mentee/my-mentors"
                    >
                        <FontAwesomeIcon icon={faUserGraduate} />
                        <div>Mentors</div>
                    </Link>
                    <Link
                        className={`mentee-nav-item ${activePage === "messenger" ? "mentee-active-page" : ""}`}
                        to="/message"
                    >
                        <FontAwesomeIcon icon={faCommentDots} />
                        <div>Messenger</div>
                    </Link>
                    <Link
                        className={`mentee-nav-item mentee-nav-item-noti ${activePage === "notification" ? "mentee-active-page" : ""}`}
                        to="/notification"
                        onClick={handleClickNoti}
                    >
                        <div style={{ textAlign: "center" }}>
                            <FontAwesomeIcon icon={faEnvelope} />
                            <div>Notification</div>
                            <div className="mentee-noti-unread">{noti > 0 && noti}</div>
                        </div>
                    </Link>
                </nav>
                {myProfile && (
                    <div className="mentee-infor-menu" onClick={toggleMenu} ref={menuRef}>
                        <img
                            className="mentee-infor-avatar"
                            src={myProfile.profilePic ? myProfile.profilePic : altImg}
                            alt="User Avatar"
                        />
                        <FontAwesomeIcon
                            icon={isMenuOpen ? faChevronUp : faChevronDown}
                            className="mentee-chevron-icon"
                            size="xs"
                            style={{ color: "#6ADBD7" }}
                        />
                    </div>
                )}
                {isMenuOpen && (
                    <div className="mentee-pop-up-logout" ref={menuRef}>
                        <p className="mentee-header-profile-name">{myProfile.fullName}</p>
                        <ul>
                            <li className="mentee-profile-setting" onClick={handleProfileSetting}>
                                Profile <FontAwesomeIcon icon={faToolbox} />
                            </li>
                            <li className="mentee-logout" onClick={handleLogout}>
                                Logout <FontAwesomeIcon icon={faRightFromBracket} />
                            </li>
                        </ul>
                    </div>
                )}
            </div>
            <div className="mentee-line"></div>
        </>
    );
}
