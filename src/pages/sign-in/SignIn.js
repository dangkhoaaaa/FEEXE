import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axiosInstance from '../../service/AxiosInstance';
import Spinner from 'react-bootstrap/Spinner';
import { useAuth } from "../../routes/AuthContext";
import HeaderHome from "../../components/header-home/HeaderHome";
import Footer from "../../components/footer/Footer";
import logo from "../../assets/logo/logo-tote.png";
import './SignIn.scss';
import { RYI_URL } from "../../URL_BE/urlbackend";

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [cookies, setCookie] = useCookies();
    const { login } = useAuth();

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);

        axiosInstance
            .post(`${RYI_URL}/Auth/login`, { email, password })
            .then((res) => res.data)
            .then((data) => {
                if (data.isSuccess) {
                    const token = data.data.token;
                    setCookie("token", token, { path: "/" });
                    login(token);
                    const role = data.data.roles[0];
                    localStorage.setItem("role", role);
                    localStorage.setItem("token", token);

                    // Redirect based on role
                    if (role === 'Admin') {
                        navigate("/admin-management");
                    } else if (role === 'Staff') {
                        navigate("/staff-management");
                    } else if (role === 'Mentor') {
                        navigate("/mentor-homepage");
                    } else if (role === 'Mentee') {
                        navigate("/mentee-homepage");
                    } else {
                        setError("Unrecognized role");
                    }
                } else {
                    setError(data.messages[0].content);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                navigate("/signin");
                if (err.response?.data?.errors?.Email) {
                    setError(err.response.data.errors.Email[0]);
                } else {
                    setError("Login failed");
                }
            });
    };

    return (
        <div className="login-container">
            <HeaderHome>
                <Link className="signup-btn" to="/signup">Sign Up</Link>
            </HeaderHome>
            <h1>Sign In</h1>
            <div className="login-main">
                <div className="form-login">
                    <form action="" className="login-form" onSubmit={handleSubmit}>
                        <h2>Welcome to Tỏ Tê</h2>
                        <div className="user">
                            <label htmlFor="email">Email:</label>
                            <input
                                id="email"
                                className="input"
                                type="text"
                                value={email}
                                placeholder="Ex. a@gmail.com"
                                onChange={(e) => setEmail(e.target.value)}
                                name="email"
                            />
                        </div>
                        <div className="password">
                            <label htmlFor="password">Password:</label>
                            <input
                                id="password"
                                className="input"
                                type="password"
                                value={password}
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                name="password"
                            />
                        </div>
                        <small className="error-mess">{error}</small>
                        <button type="submit" className="login-button">Sign In
                            {isLoading && <Spinner animation="border" />}
                        </button>
                        <div className="other-login">
                            <span className="seperate">
                                <span>----------------------------</span>
                                <span>Or </span>
                                <span>----------------------------</span>
                            </span>
                            <Link className="forgot-pass" to='/forgot-password'>Forgot Password?</Link>
                            <div>
                                <p className="no-account">Don't have an account?</p>
                                <div>
                                    <Link className="signup-mentee" to="/signup/mentee">Sign up as mentee</Link> or
                                    <Link className="signup-mentor" to="/signup/mentor">apply to be a mentor</Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="logo-login">
                    <img className="img-login" src={logo} alt="" />
                </div>
            </div>
            <Footer backgroundColor={'#6ADBD7'} color={'#274a79'}></Footer>
        </div>

    );
}

export default SignIn;
