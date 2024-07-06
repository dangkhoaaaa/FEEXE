import React, { useEffect, useState } from "react";
import "./MyProfile.scss";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import Footer from "../../../components/footer/Footer";
import axiosInstance from "../../../service/AxiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import { RYI_URL } from "../../../URL_BE/urlbackend";
import NavMentor from "../../../components/Nav-mentor/NavMentor";
import NavMentee from "../../../components/Nav-mentee/NavMentee";
import { Accordion } from "react-bootstrap";
import altImg from "../../../assets/image/noImage.png";
import SkillInputTag from "../../../components/tag-input-skill/SkillInputTag";
import SkillsList from "../../../components/mentee/mentor-skill/MentorSkills";
import NavStaff from "../../../components/Nav-staff/NavStaff";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRetro } from "@fortawesome/free-solid-svg-icons";
import ModalUpdateAvatar from "../../../components/modal/modal-update-avatar/ModalUpdateAvatar";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const tabNameToIndex = {
  0: "profile",
  1: "updateProfile",
};

const indexToTabName = {
  profile: 0,
  updateProfile: 1,
};

export default function MyProfile() {
  const [myProfile, setMyProfile] = useState({});
  const [formState, setFormState] = useState({
    fullName: "",
    phoneNumber: "",
    bio: "",
    company: "",
    jobTitle: "",
  });
  const [passwordState, setPasswordState] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [value, setValue] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const role = localStorage.getItem("role");
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setShowModal(true);
    }
  };

  const fetchAPI = () => {
    axiosInstance
      .get(`${RYI_URL}/Account/my-profile`)
      .then((response) => {
        console.log(response);
        const data = response.data.data;
        setMyProfile(data);
        setFormState({
          fullName: data.fullName || "",
          phoneNumber: data.phoneNumber || "",
          bio: data.bio || "",
          company: data.company || "",
          jobTitle: data.jobTitle || "",
        });
      })
      .catch((error) => {
        console.error("There was an error fetching profile data!", error);
      });
  };

  useEffect(() => {
    fetchAPI();
    const query = new URLSearchParams(location.search);
    const tab = query.get("tab");
    if (tab !== null && indexToTabName[tab] !== undefined) {
      setValue(indexToTabName[tab]);
    }
  }, [location.search]); // Run effect on location.search change

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(`?tab=${tabNameToIndex[newValue]}`);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });

    setSuccess(false);
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordState({
      ...passwordState,
      [name]: value,
    });
    setErrors({});
    setSuccess(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("fullName", formState.fullName);
    formData.append("phoneNumber", formState.phoneNumber);
    formData.append("bio", formState.bio);
    formData.append("company", formState.company);
    formData.append("jobTitle", formState.jobTitle);

    axiosInstance
      .put(`${RYI_URL}/Account`, formData)
      .then((response) => {
        console.log(response);
        fetchAPI();
        setSuccess(true);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.data) {
          setErrors(error.response.data.errors || {});
          console.log(error.response.data.errors);
        } else {
          console.error("There was an error updating the profile!", error);
        }
      });
  };

  const handleChangePassword = (event) => {
    event.preventDefault();

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setErrors({ confirmPassword: ["Passwords do not match."] });
      return;
    }

    axiosInstance
      .put(`${RYI_URL}/Account/change-password`, {
        oldPassword: passwordState.oldPassword,
        newPassword: passwordState.newPassword,
        confirmPassword: passwordState.confirmPassword,
      })
      .then((response) => {
        console.log(response);
        setPasswordState({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setSuccess(true);
        setErrors({});
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.data) {
          setErrors(error.response.data.errors || {});
        } else {
          console.error("There was an error changing the password!", error);
        }
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
    const fileInput = document.getElementById("image-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div>
      {role === "Mentor" ? (
        <NavMentor />
      ) : role === "Mentee" ? (
        <NavMentee />
      ) : (
        <NavStaff />
      )}
      <div className="my-profile-detail-container">
        <div className="header-my-profile">
          <img
            src={myProfile?.profilePic ? myProfile.profilePic : altImg}
            className="my-profile-detail-img"
            alt="Profile"
          />
          <FontAwesomeIcon
            className="camera-icon"
            size="2x"
            icon={faCameraRetro}
            style={{ color: "#000" }}
            onClick={() => document.getElementById("image-upload").click()}
          />
          <h2 className="account-name">{myProfile?.fullName || ""}</h2>
          <input
            type="file"
            id="image-upload"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageUpload}
          />

          {showModal && (
            <ModalUpdateAvatar
              onClose={handleCloseModal}
              selectedImage={selectedImage}
              onSetProfile={setMyProfile}
            />
          )}
        </div>
        <Box
          sx={{ width: "100%", bgcolor: "background.paper", marginTop: "40px" }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab label="Profile" {...a11yProps(0)} />
            <Tab label="Update Profile" {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <div className="body-my-profile">
              <div className="my-profile-main">
                {myProfile ? (
                  <div className="my-profile-detail">
                    <h2>{myProfile.fullName}</h2>
                    <p className="my-profile-intro">
                      <b>Email: </b> {myProfile.email}
                    </p>
                    <p className="my-profile-intro">
                      <b>Phone Number:</b> {myProfile.phoneNumber}
                    </p>
                    <p className="my-profile-intro">
                      <b>Bio:</b> {myProfile.bio}
                    </p>
                    <p className="my-profile-intro">
                      <b>Company:</b> {myProfile.company}
                    </p>
                    <p className="my-profile-intro">
                      <b>Job Title:</b> {myProfile.jobTitle}
                    </p>
                    <SkillsList
                      skills={myProfile.userSkills}
                      skillTitle={<b>Skills:</b>}
                    />
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Accordion defaultActiveKey="0" style={{ width: "70%" }}>
              <Accordion.Item eventKey="0">
                <Accordion.Header className="change-pass-header">
                  UPDATE PROFILE
                </Accordion.Header>
                <Accordion.Body>
                  <div className="update-profile">
                    <h2>Update Profile</h2>
                    <form onSubmit={handleSubmit}>
                      <div className="input-field">
                        <label>Full Name:</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formState.fullName || ""}
                          onChange={handleInputChange}
                        />
                        {errors.fullName && (
                          <span className="error-message">
                            {errors.fullName[0]}
                          </span>
                        )}
                      </div>
                      <div className="input-field">
                        <label>Phone Number:</label>
                        <input
                          type="text"
                          name="phoneNumber"
                          value={formState.phoneNumber || ""}
                          onChange={handleInputChange}
                        />
                        {errors.phoneNumber && (
                          <span className="error-message">
                            {errors.phoneNumber[0]}
                          </span>
                        )}
                      </div>
                      <div className="input-field">
                        <label>Bio:</label>
                        <textarea
                          name="bio"
                          value={formState.bio || ""}
                          onChange={handleInputChange}
                        />
                        {errors.bio && (
                          <span className="error-message">{errors.bio[0]}</span>
                        )}
                      </div>
                      <div className="input-field">
                        <label>Company:</label>
                        <input
                          type="text"
                          name="company"
                          value={formState.company || ""}
                          onChange={handleInputChange}
                        />
                        {errors.company && (
                          <span className="error-message">
                            {errors.company[0]}
                          </span>
                        )}
                      </div>
                      <div className="input-field">
                        <label>Job Title:</label>
                        <input
                          type="text"
                          name="jobTitle"
                          value={formState.jobTitle || ""}
                          onChange={handleInputChange}
                        />
                        {errors.jobTitle && (
                          <span className="error-message">
                            {errors.jobTitle[0]}
                          </span>
                        )}
                      </div>
                      {success && (
                        <div className="update-success">
                          Profile updated successfully
                        </div>
                      )}
                      <button className="btn-update-profile" type="submit">
                        Save Changes
                      </button>
                    </form>

                    <SkillInputTag />
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header className="change-pass-header">
                  CHANGE PASSWORD?
                </Accordion.Header>
                <Accordion.Body>
                  <div className="change-password">
                    <h2>Change Password</h2>
                    <form onSubmit={handleChangePassword}>
                      <div className="input-field">
                        <label>Old Password:</label>
                        <input
                          type="password"
                          name="oldPassword"
                          value={passwordState.oldPassword}
                          onChange={handlePasswordChange}
                        />
                        {errors.oldPassword && (
                          <span className="error-message">
                            {errors.oldPassword[0]}
                          </span>
                        )}
                      </div>
                      <div className="input-field">
                        <label>New Password:</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordState.newPassword}
                          onChange={handlePasswordChange}
                        />
                        {errors.newPassword && (
                          <span className="error-message">
                            {errors.newPassword[0]}
                          </span>
                        )}
                      </div>
                      <div className="input-field">
                        <label>Confirm New Password:</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordState.confirmPassword}
                          onChange={handlePasswordChange}
                        />
                        {errors.confirmPassword && (
                          <span className="error-message">
                            {errors.confirmPassword[0]}
                          </span>
                        )}
                      </div>
                      {errors.detail && (
                        <span className="error-message">{errors.detail}</span>
                      )}
                      {success ? (
                        <div className="update-success">
                          Change password successfully
                        </div>
                      ) : (
                        <div></div>
                      )}
                      <button className="btn-change-password" type="submit">
                        Change Password
                      </button>
                    </form>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </TabPanel>
        </Box>
      </div>
      <Footer backgroundColor={"#274A79"} color={"#F9FDFF"} />
    </div>
  );
}
