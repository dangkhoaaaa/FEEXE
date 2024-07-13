import React, { useRef, useState } from 'react'
import logo from "../../assets/logo/logo-tote.png"; // Import logo-tote.png
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faRightFromBracket, faToolbox } from '@fortawesome/free-solid-svg-icons';
import { logout } from '../../services/service';
import { useNavigate } from 'react-router-dom';
import altImg from "../../assets/image/noImage.png";
import './NavStaff.scss'


export default function NavStaff() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);


    const handleLogout = () => {
        logout()
            .then(response => {
                console.log('Logout successful:', response);
                navigate('/signin');
                // Delete the token cookie
                document.cookie = 'token=; path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure';
                // Clear local storage role
                localStorage.removeItem('role');
            })
            .catch(error => {
                console.error('Logout error:', error);
            });
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleProfileSetting = () => {
        navigate('/my-profile')
    }

    const handleClickLogo = () => {
        navigate('/staff-management')
    }


    return (
        <div className="home-header-container">
            <div>
                <img
                    className="logo-tote"
                    src={logo}
                    alt="Logo Tote"
                    onClick={handleClickLogo}
                />
            </div>
            <div className="infor-menu" onClick={toggleMenu} >
                <img
                    className="infor-avatar"
                    src={altImg}
                    alt="User Avatar"
                />
                <FontAwesomeIcon icon={isMenuOpen ? faChevronUp : faChevronDown} className="chevron-icon" style={{ color: "#6ADBD7" }} />
            </div>
            {isMenuOpen && (
                <div className="pop-up-logout" ref={menuRef}>
                    <ul>
                        <li className="profile-setting" onClick={handleProfileSetting}>Profile <FontAwesomeIcon icon={faToolbox} /></li>
                        <li onClick={() => { handleLogout() }} className="logout">Logout <FontAwesomeIcon icon={faRightFromBracket} /></li>
                    </ul>
                </div>
            )}
        </div>
    )
}
