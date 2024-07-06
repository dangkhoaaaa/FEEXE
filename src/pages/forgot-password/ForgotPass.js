import React, { useState } from 'react';
import './ForgotPass.scss';
import HeaderHome from '../../components/header-home/HeaderHome';
import { Link } from 'react-router-dom';
import Footer from '../../components/footer/Footer';
import axios from 'axios';
import { RYI_URL } from '../../URL_BE/urlbackend'; // Import URL from your backend configuration file
import { Spinner } from 'react-bootstrap';

export default function ForgotPass() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true)
        try {
            await axios.post(`${RYI_URL}/Auth/forgot-password`, { email })
                .then(() => {
                    setIsSubmitting(true)
                })
                .catch()
                .finally(() => {
                    setIsSubmitting(false)
                });;
            setIsSubmitted(true);
            setError('');
        } catch (err) {
            setError('Đã xảy ra lỗi, vui lòng thử lại.');
            setIsSubmitted(false);
        }
    };

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
            <div className='forgot-password'>
                <h1 className='forgot-password-title'>
                    Forgot your password? Please enter your email to receive a link to reset your password.
                </h1>
                {isSubmitted ? (
                    <p className='forgot-password-message'>
                        We have sent a password reset link to your email.
                    </p>
                ) : (
                    <form className='forgot-password-form' onSubmit={handleSubmit}>
                        <input
                            type='email'
                            placeholder='Enter your email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type='submit'>
                            {isSubmitting ? <Spinner animation="border" /> : 'Send Email'}
                        </button>
                        {error && <p className='forgot-password-error'>{error}</p>}
                    </form>
                )}
            </div>
            <Footer backgroundColor={'#6ADBD7'} color={'#274a79'}></Footer>
        </>

    );
}
