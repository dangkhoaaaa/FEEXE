import React, { useEffect } from 'react';
import './SignupSuccess.scss';
import HeaderHome from '../../../../components/header-home/HeaderHome';
import Footer from '../../../../components/footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faFaceGrinWink, faFlag } from '@fortawesome/free-regular-svg-icons';
import { Link, useNavigate } from 'react-router-dom'; // Import useLocation
import axiosInstance from '../../../../service/AxiosInstance';
import { RYI_URL } from '../../../../URL_BE/urlbackend';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignupSuccess() {
    const queryParams = new URLSearchParams(window.location.search);
    const userId = queryParams.get('userId');
    const token = queryParams.get('token');

    const decodedToken = decodeURIComponent(token);
    const navigate = useNavigate();

    const fetchConfirmAPI = () => {
        axiosInstance.get(`${RYI_URL}/Auth/confirm-email`, {
            params: {
                userId: userId,
                token: decodedToken
            }
        })
            .then(() => {
                navigate('/signin');
            })
            .catch((e) => {
                console.error('Error:', e);
            });
    };

    useEffect(fetchConfirmAPI, [userId, decodedToken]); // Chạy fetchConfirmAPI khi userId hoặc token thay đổi

    return (
        <div style={{ height: '100%', backgroundColor: '#274a79' }}>
            <HeaderHome />
            <div className='signup-success-container'>
                <div className='signup-success-background'>
                    <h2>
                        Congratulations on successfully signing up! <FontAwesomeIcon icon={faThumbsUp} />
                    </h2>
                    <p><FontAwesomeIcon icon={faFlag} /> You have one more step to complete.</p>
                    <p>
                        <small>Please check the email you registered with to confirm your membership and then return to the</small>
                        <Link className='btnsignin' to="/signin">sign-in</Link>
                        <small>page to explore the app.</small>
                    </p>
                    <p>Thank you so much. <FontAwesomeIcon icon={faFaceGrinWink} /></p>
                </div>
            </div>
            <Footer backgroundColor={'#274A79'} color={'#F9FDFF'} />
            <ToastContainer />
        </div>

    );
}
