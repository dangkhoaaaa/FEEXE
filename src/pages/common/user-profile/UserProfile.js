import React, { useEffect, useState } from 'react'
import './UserProfile.scss'
import NavMentee from '../../../components/Nav-mentee/NavMentee';
import MentorshipPlan from '../../../components/mentee/mentorship-plan/MentorshipPlan';
import ReviewMentors from '../../../components/mentee/review-mentor/ReviewMentors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faEnvelope, faMobileScreen } from '@fortawesome/free-solid-svg-icons';
import altImg from '../../../assets/image/noImage.png';
import axiosInstance from '../../../service/AxiosInstance';
import { useParams } from 'react-router-dom';
import { RYI_URL } from '../../../URL_BE/urlbackend';
import Footer from '../../../components/footer/Footer';
import NavMentor from '../../../components/Nav-mentor/NavMentor';
import SkillsList from '../../../components/mentee/mentor-skill/MentorSkills';

export default function UserProfile() {
    const role = localStorage.getItem('role')
    const { userId } = useParams();
    const [user, setUser] = useState({});
    const [userRole, setUserRole] = useState([])


    useEffect(() => {
        axiosInstance.get(`${RYI_URL}/Account/${userId}`)
            .then(response => {
                setUser(response.data.data);
                console.log('user profile', response.data.data);
                setUserRole(response.data.data.userRoles)
                console.log('user role', response.data.data.userRoles[0].name)
            })
            .catch(error => {
                console.error("There was an error fetching the user's profile!", error);
            });
    }, [userId]);

    return (
        <>
            {role === 'Mentee' ? (
                <div>
                    <NavMentee activePage="mentors" />
                    <div className='user-profile-detail-container'>
                        <div className='header-user-profile'>
                            <img src={user.profilePic ? user.profilePic : altImg} className='user-profile-detail-img' alt='Banner' />
                        </div>
                        <div className='body-user-profile'>
                            <div className='user-profile-main'>
                                <div className='user-profile-detail'>
                                    <h2>{user.fullName}</h2>
                                    <p className='job-title'>{user.jobTitle}</p>
                                    <div className='user-contact-info'>
                                        <p><FontAwesomeIcon className='font-awesome-icon' icon={faEnvelope} /> {user.email}</p>
                                        <p><FontAwesomeIcon className='font-awesome-icon' icon={faMobileScreen} /> {user.phoneNumber}</p>
                                        <p><FontAwesomeIcon className='font-awesome-icon' icon={faBuilding} /> {user.company}</p>
                                    </div>
                                </div>
                                <SkillsList skills={user.userSkills} />
                            </div>
                            <div className='user-profile-about'>
                                <h2 className='about-title'>About</h2>
                                <p className='user-about-content'>{user.bio}</p>
                            </div>
                            {userRole === "Mentor" && <ReviewMentors mentorId={userId} />}
                        </div>

                        {userRole === "Mentor" && <MentorshipPlan id={userId} />}
                    </div>
                    <Footer backgroundColor={'#274A79'} color={'#F9FDFF'} />
                </div>
            ) : (
                <div>
                    <NavMentor activePage="mentors" />
                    <div className='user-profile-detail-container'>
                        <div className='header-user-profile'>
                            <img src={user.profilePic ? user.profilePic : altImg} className='user-profile-detail-img' alt='Banner' />
                        </div>
                        <div className='body-user-profile'>
                            <div className='user-profile-main'>
                                <div className='user-profile-detail'>
                                    <h2>{user.fullName}</h2>
                                    <p className='job-title'>{user.jobTitle}</p>
                                    <div className='user-contact-info'>
                                        <p><FontAwesomeIcon className='font-awesome-icon' icon={faEnvelope} /> {user.email}</p>
                                        <p><FontAwesomeIcon className='font-awesome-icon' icon={faMobileScreen} /> {user.phoneNumber}</p>
                                        <p><FontAwesomeIcon className='font-awesome-icon' icon={faBuilding} /> {user.company}</p>
                                    </div>
                                </div>
                                <SkillsList skills={user.userSkills} />

                            </div>
                            <div className='user-profile-about'>
                                <h2>About</h2>
                                <p className='user-about-content'>{user.bio}</p>

                            </div>
                        </div>
                    </div>
                    <Footer backgroundColor={'#274A79'} color={'#F9FDFF'} />
                </div>
            )
            }
        </>
    );
}
