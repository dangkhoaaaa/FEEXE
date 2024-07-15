import React, { useEffect, useState } from "react";
import NavMentor from "../../../components/Nav-mentor/NavMentor";
import "./HomeMentor.scss";
import Footer from "../../../components/footer/Footer";
import { Link } from "react-router-dom";
import { fetchAPIMyProfile } from "../../../services/service";
import { Spinner } from "react-bootstrap";
import altImg from "../../../assets/image/noImage.png";

export default function HomeMentor() {
  const [myProfile, setMyprofile] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchMyProfile = () => {
    fetchAPIMyProfile()
      .then((response) => {
        setIsLoading(false);
        console.log(response);
        setMyprofile(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(fetchMyProfile, []);

  return (
    <div>
      <NavMentor activePage={"home"} />
      {isLoading ? (
        <div className="spinner-container">
          <Spinner animation="border" role="status" style={{ width: '1rem', height: '1rem' }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="mentor-home-container">
          <div className="welcome-home">
            <span className="user-home">
              <p>Mentor</p>
              <img
                className="img-infor-home"
                src={
                  myProfile && myProfile.profilePic
                    ? myProfile.profilePic
                    : altImg
                }
                alt="Banner"
              />
              <p>{myProfile && myProfile.fullName}</p>
            </span>
            <span>
              <h2>
                Welcome to Tỏ Tê!
                <br /> Explore the app now.
              </h2>
              <p style={{ overflowWrap: "break-word", marginLeft: "50px" }}>
                If you are visiting for the first time, please go to
                <Link
                  to="/my-profile?tab=updateProfile"
                  className="profile-setting"
                >
                  {" "}
                  Profile Setting
                </Link>
                to update your profile so that mentees can view your profile and apply for your packages.
              </p>
            </span>
          </div>
        </div>

      )}

      <Footer backgroundColor={"#274A79"} color={"#F9FDFF"} />
    </div>
  );
}
