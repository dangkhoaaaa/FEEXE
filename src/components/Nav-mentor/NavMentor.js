// NavMentor.js

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

// const backendURL = process.env.REACT_APP_API_URL;
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
        console.log(response);
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
        console.log("unread", res);
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
        console.log("Logout successful:", response);
        // Delete the token cookie
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // Clear local storage role
        localStorage.removeItem("role");
        navigate("/signin");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

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
      <div className="nav-mentee-container">
        <Link className="nav-item" to="/mentor-homepage">
          <img className="logo-tote" src={logo} alt="Logo Tote" />
        </Link>
        <nav className="nav-items">
          <Link
            className={`nav-item ${activePage === "home" ? "active-page" : ""}`}
            to="/mentor-homepage"
          >
            <FontAwesomeIcon icon={faHouse} />
            <div>Home</div>
          </Link>
          <Link
            className={`nav-item ${activePage === "workspace" ? "active-page" : ""
              }`}
            to="/mentor/workspace"
          >
            <FontAwesomeIcon icon={faPlaceOfWorship} />
            <div>My Workspace</div>
          </Link>
          <Link
            className={`nav-item ${activePage === "application" ? "active-page" : ""
              }`}
            to="/mentor/application"
          >
            <FontAwesomeIcon icon={faA} />
            <div>Application</div>
          </Link>
          <Link
            className={`nav-item ${activePage === "messenger" ? "active-page" : ""
              }`}
            to="/message"
          >
            <FontAwesomeIcon icon={faCommentDots} />
            <div>Messenger</div>
          </Link>
          <Link
            className={`nav-item nav-item-noti ${activePage === "notification" ? "active-page" : ""
              }`}
            to="/notification"
          >
            <div style={{ textAlign: "center" }} onClick={handleClickNoti}>
              <FontAwesomeIcon icon={faEnvelope} />
              <div>Notification</div>
              <div className="noti-unread">{noti > 0 && noti}</div>
            </div>
          </Link>
        </nav>
        {myProfile && (
          <div className="infor-menu" onClick={toggleMenu} ref={menuRef}>
            <img
              className="infor-avatar"
              src={myProfile.profilePic ? myProfile.profilePic : altImg}
              alt="User Avatar"
            />
            <FontAwesomeIcon
              icon={isMenuOpen ? faChevronUp : faChevronDown}
              className="chevron-icon"
              style={{ color: "#6ADBD7" }}
            />
          </div>
        )}

        {isMenuOpen && (
          <div className="pop-up-logout" ref={menuRef}>
            <ul>
              <p className="header-profile-name">{myProfile.fullName}</p>
              <li className="profile-setting" onClick={handleProfileSetting}>
                {" "}
                Profile <FontAwesomeIcon className="icon" icon={faToolbox} />
              </li>
              <li className="logout" onClick={handleLogout}>
                Logout{" "}
                <FontAwesomeIcon className="icon" icon={faRightFromBracket} />
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="line"></div>
    </>
  );
}
