import React, { useState, useEffect, useRef } from "react";
import "./NavMentor.scss";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faPlaceOfWorship,
  faCommentDots,
  faEnvelope,
  faChevronDown,
  faA,
  faChevronUp,
  faRightFromBracket,
  faToolbox,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/logo/logo-tote.png";
import axiosInstance from "../../service/AxiosInstance";
import { RYI_URL } from "../../URL_BE/urlbackend";
import altImg from "../../assets/image/noImage.png";
import { getUnreadNoti, logout, updateReadNoti } from "../../services/service";
import * as signalR from "@microsoft/signalr";

const backendURL = "https://totevn.azurewebsites.net";

export default function NavMentor({ activePage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [myProfile, setMyProfile] = useState({});
  const [noti, setNoti] = useState(0);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${backendURL}/notificationhub`)
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (message) => {
      setNotifications((prevNotifications) => [...prevNotifications, message]);
      setNoti((n) => n + 1);
    });

    connection
      .start()
      .then(() => console.log("Connection started"))
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
    axiosInstance
      .get(`${RYI_URL}/Account/my-profile`)
      .then((response) => {
        const data = response.data.data;
        setMyProfile(data); // Access the nested data
      })
      .catch((error) => {
        console.error("There was an error fetching profile data!", error);
      });
  };

  const fetchNotifications = () => {
    getUnreadNoti()
      .then((res) => {
        setNoti(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchAPI();
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    logout()
      .then((response) => {
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("role");
        localStorage.removeItem("token");
        navigate("/signin");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const handleClickNoti = () => {
    setNoti(0);
    updateReadNoti()
      .then((res) => { })
      .catch((err) => {
        console.log(err);
      });
    fetchNotifications();
  };

  return (
    <>
      <div className="mentor-nav-container">
        <Link className="mentor-nav-item" to="/mentor-homepage">
          <img className="mentor-logo-tote" src={logo} alt="Logo Tote" />
        </Link>
        <nav className="mentor-nav-items">
          <Link
            className={`mentor-nav-item ${activePage === "home" ? "mentor-active-page" : ""}`}
            to="/mentor-homepage"
          >
            <FontAwesomeIcon icon={faHouse} />
            <span>Home</span>
          </Link>
          <Link
            className={`mentor-nav-item ${activePage === "workspace" ? "mentor-active-page" : ""}`}
            to="/mentor/workspace"
          >
            <FontAwesomeIcon icon={faPlaceOfWorship} />
            <span>My Workspace</span>
          </Link>
          <Link
            className={`mentor-nav-item ${activePage === "application" ? "mentor-active-page" : ""}`}
            to="/mentor/application"
          >
            <FontAwesomeIcon icon={faA} />
            <span>Application</span>
          </Link>
          <Link
            className={`mentor-nav-item ${activePage === "messenger" ? "mentor-active-page" : ""}`}
            to="/message"
          >
            <FontAwesomeIcon icon={faCommentDots} />
            <span>Messenger</span>
          </Link>
          <Link
            className={`mentor-nav-item nav-item-noti ${activePage === "notification" ? "mentor-active-page" : ""}`}
            to="/notification"
            onClick={handleClickNoti}
          >
            <FontAwesomeIcon icon={faEnvelope} />
            <span>Notification</span>
            <span className="noti-unread">{noti > 0 && noti}</span>
          </Link>
        </nav>
        {myProfile && (
          <div className="mentor-infor-menu" onClick={toggleMenu} ref={menuRef}>
            <img
              className="mentor-infor-avatar"
              src={myProfile.profilePic ? myProfile.profilePic : altImg}
              alt="User Avatar"
            />
            <FontAwesomeIcon
              icon={isMenuOpen ? faChevronUp : faChevronDown}
              className="mentor-chevron-icon"
            />
          </div>
        )}
        {isMenuOpen && (
          <div className="mentor-pop-up-logout" ref={menuRef}>
            <ul>
              <p className="mentor-header-profile-name">{myProfile.fullName}</p>
              <li className="profile-setting" onClick={handleProfileSetting}>
                Profile <FontAwesomeIcon className="mentor-icon" icon={faToolbox} />
              </li>
              <li className="logout" onClick={handleLogout}>
                Logout <FontAwesomeIcon className="mentor-icon" icon={faRightFromBracket} />
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="mentor-line"></div>
    </>
  );
}
