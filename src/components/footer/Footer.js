import React from "react";
import './Footer.scss'
import logo from "../../assets/logo/logo-tote.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faCopyright, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";

function Footer({ backgroundColor, color }) {
    return (
        <>
            <div className="footer-container" style={{ backgroundColor: backgroundColor, color: color }}>
                <div className="social-media">
                    <img className="footer-logo" src={logo} alt="Logo" />
                    <div className="icons">
                        <a href="https://www.facebook.com/totementoring" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebook} size="2x" />
                        </a>
                        <a href="https://www.tiktok.com/@t.t.mentoring" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faTiktok} size="2x" />
                        </a>
                    </div>
                </div>
                <div className="contact">
                    <h5>Contact</h5>
                    <div><FontAwesomeIcon icon={faEnvelope} /> - totementoring@gmail.com</div>
                    <div><FontAwesomeIcon icon={faPhone} /> - 070 876 7559</div>
                    <div><FontAwesomeIcon icon={faLocationDot} /> - Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành phố Thủ Đức, Ho Chi Minh City, Vietnam</div>
                </div>
            </div>
            <div className="copyright-container" style={{ backgroundColor: backgroundColor, color: color }}>
                <span className="copyright" >Copyright <FontAwesomeIcon icon={faCopyright} /> 2024</span>
                <span className="all-rights-reserved"> All rights reserved | </span>
            </div>
        </>
    );
}

export default Footer;
