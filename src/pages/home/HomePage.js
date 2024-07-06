import React from "react";
import "./HomePage.scss";
import HeaderHome from "../../components/header-home/HeaderHome";
import Footer from "../../components/footer/Footer";
import { Link } from "react-router-dom";
// import banner from "../../assets/image/banner_tote.png";

function HomePage() {
  return (
    <div className="home_container">
      <HeaderHome>
        <Link className="login-btn" to="/signin">
          Sign In
        </Link>
        <Link className="signin-btn" to="/signup">
          Sign Up
        </Link>
      </HeaderHome>
      <div className="home_banner">
        <img className="banner-img-main" src='https://nhilty302814.blob.core.windows.net/tortee/Frame 4 (1).png' alt="banner Tote" />
      </div>
      <Footer backgroundColor={"#fff"} color={"#274a79"} />
    </div>
  );
}

export default HomePage;
