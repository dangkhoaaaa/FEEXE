import React, { useEffect, useState } from "react";
import NavMentee from "../../../components/Nav-mentee/NavMentee";
import Footer from "../../../components/footer/Footer";
import "./MyWorkSpace.scss";
import axiosInstance from "../../../service/AxiosInstance";
import { RYI_URL } from "../../../URL_BE/urlbackend";
import altImg from "../../../assets/image/noImage.png";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAirbnb,
  faFreeCodeCamp,
  faJava,
  faLinux,
  faStudiovinari,
} from "@fortawesome/free-brands-svg-icons";
import {
  faPenToSquare,
  faStar,
  faSun,
} from "@fortawesome/free-regular-svg-icons";
import {
  faCloudArrowDown,
  faPhotoFilm,
  faVolleyball,
} from "@fortawesome/free-solid-svg-icons";
import { ListGroup } from "react-bootstrap";
import ModalAddReview from "../../../components/modal/modal-add-review/ModalAddReview";

export default function MyWorkspace() {
  const [activeContent, setActiveContent] = useState("mentors");
  const [myMentors, setMyMentors] = useState([]);
  const [myAssignments, setMyAssignments] = useState([]);
  const [mySubmissions, setMySubmission] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [showModalFeed, setShowModalFeed] = useState(false);
  const [feedbackInfors, setFeedBackInfors] = useState([]);
  const [mentorID, setMentorID] = useState("");

  const icons = [
    faAirbnb,
    faLinux,
    faSun,
    faJava,
    faFreeCodeCamp,
    faVolleyball,
    faPhotoFilm,
    faStudiovinari,
  ];

  const fetchFeedbackAPI = async () => {
    try {
      const response = await axiosInstance.get(
        `${RYI_URL}/Feedback/send-feedback`
      );
      console.log("feedback", response);
      setFeedBackInfors(response.data.data);
    } catch (error) {
      console.log("There is an error fetching feedback", error);
    }
  };
  useEffect(() => {
    const fetchMentorListAPI = async () => {
      try {
        const response = await axiosInstance.get(
          `${RYI_URL}/Workspace/mentee/my-mentors`
        );
        console.log(response.data.data);
        setMyMentors(response.data.data);
      } catch (error) {
        console.log("There is an error fetching mentors", error);
      }
    };

    const fetchAssignAPI = async () => {
      try {
        const response = await axiosInstance.get(
          `${RYI_URL}/Workspace/mentee/my-assignments`
        );
        console.log("assignments", response.data.data);
        setMyAssignments(response.data.data);
      } catch (error) {
        console.log("There is an error fetching assignments", error);
      }
    };

    const fetchSubmissionAPI = async () => {
      try {
        const response = await axiosInstance.get(
          `${RYI_URL}/Workspace/mentee/my-submissions`
        );
        console.log("submission", response.data.data);
        setMySubmission(response.data.data);
      } catch (error) {
        console.log("There is an error fetching submissions", error);
      }
    };

    const fetchData = async () => {
      await fetchMentorListAPI();
      await fetchAssignAPI();
      await fetchSubmissionAPI();
      await fetchFeedbackAPI();
    };

    fetchData();
  }, []);

  const handleShowReviewModal = (mentorId) => {
    setShowModalFeed(true);
    setMentorID(mentorId);
  };

  const handleCloseReviewModal = () => {
    setShowModalFeed(false);
    fetchFeedbackAPI();
  };

  const renderBanner = () => {
    switch (activeContent) {
      case "assignment":
        return <h2>Projects/ Tasks</h2>;
      case "submission":
        return <h2>My Submissions</h2>;
      case "mentors":
        return <h2>Mentors List</h2>;
      case "feedbacks":
        return <h2>Mentors List</h2>;
      default:
        return <h2>Projects/Tasks</h2>;
    }
  };

  const renderWorkspaceContent = () => {
    switch (activeContent) {
      case "assignment":
        return (
          <div className="assignment-workspace-container">
            {myAssignments.length ? (
              myAssignments.map((assignment, index) => (
                <div
                  key={assignment.id}
                  className="assignment-item"
                  onClick={() => handleClickAssignItem(assignment)}
                >
                  <FontAwesomeIcon
                    className="font-awesome-icon-assignment"
                    icon={icons[index % icons.length]}
                  />
                  <h3>{assignment.title}</h3>
                  {assignment.isSubmited ? (
                    <div className="is-submitted">is submitted</div>
                  ) : (
                    <div></div>
                  )}
                  <p>
                    <b>Assigned by:</b> {assignment.mentor.fullName}
                  </p>
                  <p>
                    <b>Assigned date:</b> {formatDate(assignment.assignedDate)}
                  </p>
                </div>
              ))
            ) : (
              <div>There are no assignments.</div>
            )}
          </div>
        );
      case "submission":
        return (
          <div className="submission-workspace-container">
            {mySubmissions.length ? (
              mySubmissions.map((sub) => (
                <div key={sub.id} className="submission-item">
                  <p>
                    <a
                      className="download-file"
                      href={sub.file}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      File Submitted <FontAwesomeIcon icon={faCloudArrowDown} />
                    </a>
                  </p>
                  <ListGroup className="list-submitted-info">
                    <ListGroup.Item>
                      <b>Submitted Date:</b> {formatDate(sub.submittedDate)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <b>Grade:</b> {sub.grade}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <b>Submission Status:</b>{" "}
                      <span
                        className={
                          sub.status === "UNGRADED" ? "ungraded" : "graded"
                        }
                      >
                        {sub.status}
                      </span>
                    </ListGroup.Item>
                    {sub.commentOfMentor ? (
                      <ListGroup.Item>
                        <b>Mentor's comment:</b> {sub.commentOfMentor}
                      </ListGroup.Item>
                    ) : (
                      <></>
                    )}
                    {role === "Mentor" && (
                      <ListGroup.Item>
                        <button className="btn-grade">
                          <FontAwesomeIcon icon={faPenToSquare} /> Grade
                        </button>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </div>
              ))
            ) : (
              <div>There are no submissions.</div>
            )}
          </div>
        );
      case "mentors":
        return (
          <div className="mentor-workspace-container">
            {myMentors.length ? (
              myMentors.map((mentor) => (
                <div className="mentor-workspace-item">
                  <img
                    className="mentor-item-img"
                    src={mentor.profilePic ? mentor.profilePic : altImg}
                    alt={mentor.fullName}
                    onError={(e) => {
                      e.target.src = altImg;
                    }}
                    onClick={() => {
                      handleSelectMentor(mentor.id);
                    }}
                  />
                  <h3>{mentor.fullName}</h3>
                  <p>{mentor.jobTitle}</p>
                </div>
              ))
            ) : (
              <div>There are no mentors</div>
            )}
          </div>
        );
      case "feedbacks":
        return (
          <div className="feedback-workspace-container">
            {feedbackInfors ? (
              feedbackInfors.map((feed) => (
                <div className="feedback-workspace-item">
                  <img
                    className="feedback-item-img"
                    src={
                      feed.userResponse.profilePic
                        ? feed.userResponse.profilePic
                        : altImg
                    }
                    alt={feed.userResponse.fullName}
                  />
                  <h5>{feed.userResponse.fullName}</h5>
                  {!feed.isFeedbacked ? (
                    <button
                      className="review-btn"
                      onClick={() => {
                        handleShowReviewModal(feed.menteeApplicationId);
                      }}
                    >
                      Add Feedback
                    </button>
                  ) : (
                    <p style={{ color: "#39aa3e" }}>You have sent feedback!</p>
                  )}
                </div>
              ))
            ) : (
              <div>There are no feedbacks</div>
            )}
            {showModalFeed && (
              <ModalAddReview
                mentorId={mentorID}
                onClose={handleCloseReviewModal}
              />
            )}
          </div>
        );
      default:
        return <div>Default Content</div>;
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options); // Use 'en-GB' for DD-MM-YYYY format
  };

  const handleClickAssignItem = (assignment) => {
    navigate(`/workspace/assignment/${assignment.id}`);
  };

  const handleSelectMentor = (id) => {
    navigate(`/userProfile/${id}`);
  };

  return (
    <div>
      <NavMentee activePage="workspace" />
      <div className="workspace-container">
        <div className="navbar-workspace">
          <button
            className={`btn-workspace mentors ${
              activeContent === "mentors" ? "active" : ""
            }`}
            onClick={() => setActiveContent("mentors")}
          >
            My Mentors
          </button>
          <button
            className={`btn-workspace btn-assignment ${
              activeContent === "assignment" ? "active" : ""
            }`}
            onClick={() => setActiveContent("assignment")}
          >
            My Assignment Received
          </button>
          <button
            className={`btn-workspace btn-submission ${
              activeContent === "submission" ? "active" : ""
            }`}
            onClick={() => setActiveContent("submission")}
          >
            My Submission
          </button>

          <button
            className={`btn-workspace mentors ${
              activeContent === "feedbacks" ? "active" : ""
            }`}
            onClick={() => setActiveContent("feedbacks")}
          >
            Sent Feedback
          </button>
        </div>
        <div className="content-workspace">
          <div className="banner-project">{renderBanner()}</div>
          <div className="my-workspace">{renderWorkspaceContent()}</div>
        </div>
      </div>
      <Footer backgroundColor={"#274A79"} color={"#F9FDFF"} />
    </div>
  );
}
