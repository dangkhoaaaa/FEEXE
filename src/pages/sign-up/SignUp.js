import React from "react";
import './SignUp.scss';
import HeaderHome from "../../components/header-home/HeaderHome";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard } from "@fortawesome/free-regular-svg-icons";
import Footer from "../../components/footer/Footer";


function SignUp() {
    return (
        <div className="sign-up_container">
            <HeaderHome>
                <Link className="signin-btn" to="/signin">Đăng nhập</Link>
            </HeaderHome>
            <div className="signup-button">
                <div>
                    <h1>Đăng ký tài khoản</h1>
                    <small className="signup-guide">Hãy chọn phương thức đăng ký</small>
                </div>
                <Link className="signup-mentee" to="/signup/mentee"><FontAwesomeIcon icon={faAddressCard} /> <span>Sign up as Mentee</span></Link>
                <Link className="signup-mentor" to="/signup/mentor"><FontAwesomeIcon icon={faAddressCard} /> <span>Sign up as Mentor</span></Link>
            </div>
            <Footer backgroundColor={'#6ADBD7'} color={'#274a79'}></Footer>
        </div>
    )
}
export default SignUp;
