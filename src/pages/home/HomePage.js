import React from "react";
import "./HomePage.scss";
import HeaderHome from "../../components/header-home/HeaderHome";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStarOfLife } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/logo/logo-tote.png";
import img1 from "../../assets/image/banner-img1.png";
import img2 from "../../assets/image/banner-img2.png";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import banner from "../../assets/image/banner_tote.png";

function HomePage() {
  const dataImage = [
    { img: logo, title: "" },
    { img: img1, title: "" },
    { img: img2, title: "" },
  ];

  return (
    <div className="home_container">
      <HeaderHome>
        <Link className="login-btn" to="/signin">
          Đăng nhập
        </Link>
        <Link className="signin-btn" to="/signup">
          Đăng ký
        </Link>
      </HeaderHome>
      <div className="home_banner">
        <img className="banner-img-main" src={banner} alt="banner Tote" />
      </div>
      {/* <Link to="/admin-management" style={{ margin: "20px", color: "#fff" }}>
        admin
      </Link> */}
      <Footer backgroundColor={"#fff"} color={"#274a79"} />
    </div>
  );
}

export default HomePage;
