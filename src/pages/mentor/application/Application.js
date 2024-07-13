import React, { useEffect, useState } from "react";
import NavMentor from "../../../components/Nav-mentor/NavMentor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import Footer from "../../../components/footer/Footer";
import "./Application.scss";
import axiosInstance from "../../../service/AxiosInstance";
import { RYI_URL } from "../../../URL_BE/urlbackend";
import img from "../../../assets/image/banner-img2.jpg";
import { Link, useNavigate } from "react-router-dom";
import altImg from '../../../assets/image/noImage.png'

export default function MentorApplication() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const fetchApplicationApi = () => {
    axiosInstance
      .get(`${RYI_URL}/mentor/applications`)
      .then((response) => {
        console.log(response);
        setApplications(response.data.data);
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  };

  useEffect(() => {
    fetchApplicationApi();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options); // Use 'en-GB' for DD-MM-YYYY format
  };

  const handleViewDetail = (application) => {
    navigate(`/application/${application.id}`);
  };

  return (
    <>
      <NavMentor activePage="application" />
      <div className="mentor-applications-container">
        <h1>Applications Received</h1>
        <div
          className={`${applications.length > 0
            ? "applications-list-mentor"
            : "no-applications-list"
            }`}
        >
          {applications && applications.length > 0 ? (
            applications.map((application, index) => (
              <div key={index} className="application-item">
                <img
                  className="img-application-mentor"
                  src={application.user.profilePic ? application.user.profilePic : altImg}
                  alt={application.user.fullName}
                  onError={(e) => {
                    e.target.src = img;
                  }}
                />
                <div>
                  <h3>{application.user.fullName}</h3>
                  <p>
                    <b>Applied date: </b> {formatDate(application.appliedDate)}
                  </p>
                  <p>
                    <b>Email: </b> {application.user.email}
                  </p>
                  <p>
                    <b>Status: </b>{" "}
                    <span
                      className={` status ${application.status === "PENDING"
                        ? "pending-status"
                        : application.status === "ACCEPTED"

                          ? "accept-status"
                          : application.status === "DENIED"
                            ? "denied-status"
                            : "status-paid"
                        }`}

                    >
                      {application.status}
                    </span>
                  </p>
                  <button
                    className="btn-view-detail-application"
                    onClick={() => handleViewDetail(application)}
                  >
                    View detail
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-applications">
              <FontAwesomeIcon icon={faFileLines} size="3x" />
              <br />
              <b>No active applications</b>
            </div>
          )}
        </div>
      </div>
      <Footer backgroundColor={"#274A79"} color={"#F9FDFF"} />
    </>
  );
}
