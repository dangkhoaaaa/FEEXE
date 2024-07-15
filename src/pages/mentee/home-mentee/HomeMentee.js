import React, { useEffect, useState } from "react";
import "./HomeMentee.scss";
import NavMentee from "../../../components/Nav-mentee/NavMentee";
import image from "../../../assets/image/banner-img1.jpg";
import Carousel from 'react-bootstrap/Carousel';
import Footer from '../../../components/footer/Footer'
import { RYI_URL } from '../../../URL_BE/urlbackend'
import axiosInstance from "../../../service/AxiosInstance";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import img from '../../../assets/image/noImage.png'
import { fetchAPIMyProfile } from "../../../services/service";
import { Spinner } from "react-bootstrap";
import altImg from '../../../assets/image/noImage.png'

function groupProfiles(profiles, perGroup) {
    const groups = [];
    for (let i = 0; i < profiles.length; i += perGroup) {
        groups.push(profiles.slice(i, i + perGroup));
    }
    return groups;
}


export default function MenteeHomePage() {
    const [mentorRecommend, setMentorRecommend] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const groupedProfiles = groupProfiles(mentorRecommend, 2);

    useEffect(() => {
        axiosInstance.get(`${RYI_URL}/Mentor/recommendation?PageSize=100`)
            .then(response => {
                setMentorRecommend(response.data.data.data);
                console.log(response.data.data.data);
            })
            .catch(error => {
                console.error("There was an error fetching the mentors!", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const [myProfile, setMyprofile] = useState({})

    const fetchMyProfile = () => {
        fetchAPIMyProfile().then((response) => {
            console.log(response)
            setMyprofile(response.data.data)
        })
            .catch((err) => {
                console.log(err);
            }).finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(fetchMyProfile, [])


    return (
        <div>
            <NavMentee activePage="home" />
            {isLoading ? (
                <div className="spinner-container">
                    <Spinner animation="border" role="status" style={{ width: '1rem', height: '1rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <div className="mentee-home-container">
                    <div className="welcome-home">
                        <span className="user-home">
                            <p>Mentee</p>
                            <img className="img-infor-home" src={myProfile.profilePic ? myProfile.profilePic : altImg} alt="Banner" />
                            <p>{myProfile && myProfile.fullName}</p>
                        </span>
                        <span>
                            <h2>Welcome to Tỏ Tê!<br /> Feel free to explore the app.</h2>
                            <p style={{ overflowWrap: 'break-word', marginLeft: '50px' }}>
                                If this is your first time visiting, please go to
                                <Link to='/my-profile?tab=updateProfile' className='profile-setting'> Profile Setting</Link>
                                to update your profile so that mentees can view your profile and apply for your packages.
                            </p>
                        </span>

                    </div>
                    <div className="mentor-propose-list">
                        <p className="propose">Recommended mentors:</p>

                        <Carousel className="mentors-propose" data-bs-theme="dark" interval={2000} controls={false} wrap={true}>
                            {groupedProfiles.map((group, index) => (
                                <Carousel.Item key={index}>
                                    <div className="d-flex">
                                        {group.map(mentor => (
                                            <div className="mentor-card-re" key={mentor.id}>
                                                <div className="mentor-image">
                                                    <img src={mentor.profilePic || img} className='img-mentor-profile' alt='img-mentor-profile' />
                                                </div>
                                                <div className="mentor-info">
                                                    <p >{mentor.fullName}</p>
                                                    <p>JOB: {mentor.jobTitle ? mentor.jobTitle : '....'}</p>
                                                    <p><FontAwesomeIcon icon={faLocationDot} /> {mentor.company ? mentor.company : '...'}</p>

                                                    <span>{mentor.bio}</span>
                                                    <Link to={`/userProfile/${mentor.id}`} className='btn-view-profile-re'>View Profile</Link>
                                                </div>
                                            </div>

                                        ))}
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>
                </div>
            )}

            <Footer backgroundColor={'#274A79'} color={'#F9FDFF'} />
        </div>
    );
}
