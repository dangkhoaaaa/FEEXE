import React, { useState, useEffect } from 'react';
import './SignUpMentee.scss';
import HeaderHome from "../../../components/header-home/HeaderHome";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faCheck } from '@fortawesome/free-solid-svg-icons';
import logo from '../../../assets/logo/logo-tote.png';
import { RYI_URL } from '../../../URL_BE/urlbackend';
import axiosInstance from '../../../service/AxiosInstance';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignUpMentee() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [passwordValidations, setPasswordValidations] = useState({
        length: false,
        number: false,
        uppercase: false,
        lowercase: false
    });

    const handleBack = () => {
        navigate(-1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
        setErrors('')
    };

    useEffect(() => {
        const { password } = formData;
        setPasswordValidations({
            length: password.length > 6,
            number: /\d/.test(password),
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password)
        });
    }, [formData.password]);

    const validate = () => {
        let newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else {
            if (formData.password.length <= 6) newErrors.password = 'Password must be more than 6 characters';
            if (!/\d/.test(formData.password)) newErrors.password = newErrors.password ? `${newErrors.password}, and include a number` : 'Password must include a number';
            if (!/[A-Z]/.test(formData.password)) newErrors.password = newErrors.password ? `${newErrors.password}, and include an uppercase letter` : 'Password must include an uppercase letter';
            if (!/[a-z]/.test(formData.password)) newErrors.password = newErrors.password ? `${newErrors.password}, and include a lowercase letter` : 'Password must include a lowercase letter';
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            axiosInstance.post(`${RYI_URL}/Auth/register`, formData)
                .then(response => {
                    console.log('Form submitted successfully:', response.data);
                    setErrors('');
                    navigate('/mentee-signup-success')
                })
                .catch(error => {
                    console.error('There was an error registering!', error);
                    if (error.response && error.response.data) {
                        setErrors({ apiError: error.response.data.message, duplicatedError: error.response.data.detail });
                    }
                });
        }
    };

    return (
        <div className="sign-up-mentee_container">
            <HeaderHome />

            <div className='signup-mentee-container'>
                <h2>Sign up as a Mentee</h2>
                <div className='sign-up_mentee'>
                    <div className='sign-up_img'>
                        <Link to='/'>
                            <img src={logo} alt='logo-img' />
                        </Link>
                    </div>
                    <form className='sign-up_form' onSubmit={handleSubmit}>
                        <div className='input-field input-first-name'>
                            <label className='label'>First name:</label>
                            <input
                                type='text'
                                name='firstName'
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`input ${errors.firstName ? 'input-error' : ''}`}
                            />
                            {errors.firstName && <span className='error-message'>{errors.firstName}</span>}
                        </div>
                        <div className='input-field input-last-name'>
                            <label className='label'>Last name:</label>
                            <input
                                type='text'
                                name='lastName'
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`input ${errors.lastName ? 'input-error' : ''}`}
                            />
                            {errors.lastName && <span className='error-message'>{errors.lastName}</span>}
                        </div>
                        <div className='input-field input-email'>
                            <label className='label'>Email:</label>
                            <input
                                type='email'
                                name='email'
                                placeholder='Ex: a@gmail.com'
                                value={formData.email}
                                onChange={handleChange}
                                className={`input ${errors.email ? 'input-error' : ''}`}
                            />
                            {errors.email && <span className='error-message'>{errors.email}</span>}
                        </div>
                        <div className='input-field input-password'>
                            <label className='label'>Password:</label>
                            <input
                                type='password'
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                className={`input ${errors.password ? 'input-error' : ''}`}
                            />
                            {errors.password && <span className='error-message'>{errors.password}</span>}
                        </div>
                        {errors.apiError && <div className='error-message'>{errors.apiError}</div>}
                        <div className='password-requirements'>
                            <small className={`requirement ${passwordValidations.length ? 'valid' : ''}`}>
                                {passwordValidations.length && <FontAwesomeIcon icon={faCheck} />} Password must be longer than 6 characters
                            </small><br />
                            <small className={`requirement ${passwordValidations.number ? 'valid' : ''}`}>
                                {passwordValidations.number && <FontAwesomeIcon icon={faCheck} />} Password must contain a number
                            </small><br />
                            <small className={`requirement ${passwordValidations.uppercase ? 'valid' : ''}`}>
                                {passwordValidations.uppercase && <FontAwesomeIcon icon={faCheck} />} Password must contain an uppercase letter
                            </small><br />
                            <small className={`requirement ${passwordValidations.lowercase ? 'valid' : ''}`}>
                                {passwordValidations.lowercase && <FontAwesomeIcon icon={faCheck} />} Password must contain a lowercase letter
                            </small>
                        </div>
                        {errors.duplicatedError && <small className='error-message'>{errors.duplicatedError}</small>}
                        <button className='sign-up_btn'>Sign Up</button>
                        <div className='login-redirect'>
                            <p>Already have an account? <Link to='/signin'>Sign In</Link></p>
                        </div>
                    </form>
                </div>
            </div>
            <button className="back-btn" onClick={handleBack}><FontAwesomeIcon icon={faBackward} /> Back</button>
            <Footer backgroundColor={'#274A79'} color={'#F9FDFF'} />
            <ToastContainer />
        </div>

    );
}

export default SignUpMentee;
