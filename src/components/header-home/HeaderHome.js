import React from "react";
import logo from "../../assets/logo/logo-tote.png"; // Import logo-tote.png
import './HeaderHome.scss'
import { Link } from "react-router-dom";

function HeaderHome({ children }) {

    return (
        <div className="home-header-container">
            <Link to="/">
                <img
                    className="logo-tote"
                    src={logo} // Sử dụng biến 'logo' như một đường dẫn đến logo
                    alt="Logo Tote"
                />
            </Link>
            <div className="header-right-side">
                {children}
            </div>
        </div>
    );
}

export default HeaderHome;
