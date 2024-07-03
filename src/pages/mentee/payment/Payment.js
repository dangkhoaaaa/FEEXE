import React, { useEffect, useRef, useState } from 'react';
import './Payment.scss';
import HeaderHome from '../../../components/header-home/HeaderHome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faCommentsDollar, faRightFromBracket, faToolbox } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../components/footer/Footer'
import { faCreditCard } from '@fortawesome/free-regular-svg-icons';

export default function Payment() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const popUpRef = useRef(null);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        // Perform any logout logic here
        navigate('/logout'); // Change this path to your logout route
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target) &&
            popUpRef.current && !popUpRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    };

    const handleProfileSetting = () => {
        navigate('/mentee/mentee-profile-setting'); // Change this path to your profile setting route
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className='mentee-payment-container'>
            <HeaderHome>
                <div className="infor-menu" onClick={toggleMenu} ref={menuRef}>
                    <img
                        className="infor-avatar"
                        src="https://via.placeholder.com/40"
                        alt="User Avatar"
                    />
                    <FontAwesomeIcon icon={isMenuOpen ? faChevronUp : faChevronDown} className="chevron-icon" size="xs" style={{ color: "#6ADBD7" }} />
                </div>
                {isMenuOpen && (
                    <div className="pop-up-logout" ref={popUpRef}>
                        <ul>
                            <li className="profile-setting" onClick={handleProfileSetting}>
                                Profile setting <FontAwesomeIcon icon={faToolbox} />
                            </li>
                            <li className="logout" onClick={handleLogout}>
                                Logout <FontAwesomeIcon icon={faRightFromBracket} />
                            </li>
                        </ul>
                    </div>
                )}
            </HeaderHome>
            <div className='payment-container'>
                <form className='payment-form'>
                    <h5>Phương thức thanh toán</h5>
                    <div className='payment-methods'>
                        <div className='payment-momo'>
                            <input type='radio' name='momo' id='momo' />
                            <label for='momo' className='momo'>Momo</label>
                        </div>
                        <div className='payment-credit'>
                            <input type='radio' name='credit' id='credit' />
                            <label for='credit' className='credit'>Credit <FontAwesomeIcon icon={faCreditCard} /></label>
                        </div>
                    </div>
                </form>
                <div className='payment-content'>
                    <h1>Payment <FontAwesomeIcon icon={faCommentsDollar} /></h1>
                    <p>Hãy điền thông tin thanh toán.</p>
                </div>
            </div>
            <Footer backgroundColor={'#274a79'} color={'#fff'} />
        </div>
    );
}
