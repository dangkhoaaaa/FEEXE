import React, { useEffect, useState } from 'react';
import './MentorshipPlan.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import { faClock, faComments } from '@fortawesome/free-regular-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../service/AxiosInstance';
import { RYI_URL } from '../../../URL_BE/urlbackend';

const MentorshipPlan = ({ id }) => {
    const navigate = useNavigate();
    const [mentorshipPlan, setMentorshipPlan] = useState({});

    const handleApply = () => {
        if (mentorshipPlan && mentorshipPlan.id) {
            navigate(`/mentee/mentor-profile/apply-confirm/${mentorshipPlan.id}`);
        }
    };

    const fetchMentorshipPlanAPI = () => {
        axiosInstance.get(`${RYI_URL}/MenteePlan/${id}`)
            .then(response => {
                setMentorshipPlan(response.data.data);
                console.log(response);
            })
            .catch(error => {
                console.error("There was an error fetching the mentorship plan!", error);
            });
    };

    useEffect(fetchMentorshipPlanAPI, [id]);

    return (
        <div className='mentorship-plan-container'>
            <h3>Mentorship Plan</h3>
            {mentorshipPlan ? (
                <div className='mentorship-plan'>
                    <h2>{mentorshipPlan.price}(VND)/month</h2>
                    <p>{mentorshipPlan.descriptionOfPlan}</p>
                    <div style={{ marginTop: '30px' }}>
                        <p><FontAwesomeIcon className='icon-mentorship-plan' icon={faPhoneVolume} /> {mentorshipPlan.callPerMonth} calls per month ({mentorshipPlan.durationOfMeeting}min/call)</p>
                        <p><FontAwesomeIcon className='icon-mentorship-plan' icon={faComments} /> Unlimited Q&A via chat</p>
                        <p><FontAwesomeIcon className='icon-mentorship-plan' icon={faClock} /> Remain {mentorshipPlan.remainSlot} slots</p>
                        <p><FontAwesomeIcon className='icon-mentorship-plan' icon={faBriefcase} /> Hands-on support</p>
                    </div>
                    {mentorshipPlan.status !== 'Available' && <small style={{ color: 'red' }}>Slots are full, please choose another mentorship plan</small>}
                    {mentorshipPlan.isInMentorship === true && <small style={{ color: 'red' }}>You are already in mentorship with this mentee</small>}
                    <button
                        className='btn-apply-now'
                        onClick={handleApply}
                        disabled={mentorshipPlan.status !== 'Available' || mentorshipPlan.isInMentorship === true}
                    >
                        Apply now
                    </button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default MentorshipPlan;
