import React, { useState, useEffect } from 'react';
import './ResetPassword.scss';
import HeaderHome from '../../components/header-home/HeaderHome';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/footer/Footer';
import axios from 'axios';
import { RYI_URL } from '../../URL_BE/urlbackend'; // Import URL from your backend configuration file

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const token = queryParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Confirm password does not match new password.');
            return;
        }
        try {
            axios.post(`${RYI_URL}/Auth/reset-password`, {
                email: email,
                resetCode: token,
                newPassword: newPassword
            }).then((res) => {
                console.log(res);
            });
            setIsSuccess(true);
            setError('');
        } catch (err) {
            setError('Đã xảy ra lỗi, vui lòng thử lại.');
            setIsSuccess(false);
        }
    };

    useEffect(() => {
        console.log(token)
    }, [])

    return (
        <>
            <HeaderHome>
                <Link className="login-btn" to="/signin">
                    Sign In
                </Link>
                <Link className="signin-btn" to="/signup">
                    Sign Up
                </Link>
            </HeaderHome>
            <div className='reset-password-container'>
                <h1 className='reset-password-title'>
                    Please enter the new password you want to change.
                </h1>
                {isSuccess ? (
                    <p className='reset-password-success'>
                        The password has been successfully changed. Please go back to the sign-in page and try again.
                    </p>
                ) : (
                    <form className='reset-password-form' onSubmit={handleSubmit}>
                        <input
                            type='password'
                            placeholder='New password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <input
                            type='password'
                            placeholder='Confirm new password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button type='submit'>Change Password</button>
                        {error && <p className='reset-password-error'>{error}</p>}
                    </form>
                )}
            </div>
            <Footer backgroundColor={'#6ADBD7'} color={'#274a79'}></Footer>
        </>

    );
}
