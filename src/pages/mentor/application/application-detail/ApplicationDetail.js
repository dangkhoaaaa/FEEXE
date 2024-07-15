import React, { useEffect, useState } from 'react';
import './ApplicationDetail.scss';
import NavMentor from '../../../../components/Nav-mentor/NavMentor';
import Footer from '../../../../components/footer/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import altImg from '../../../../assets/image/noImage.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons';
import { faBomb, faBriefcase, faClock, faComments, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../../../service/AxiosInstance';
import { RYI_URL } from '../../../../URL_BE/urlbackend';
import NavMentee from '../../../../components/Nav-mentee/NavMentee';
import { Spinner } from 'react-bootstrap';

export default function ApplicationDetail() {
    const navigate = useNavigate();
    const { applicationId } = useParams();
    const [detail, setDetail] = useState(null); // Initialize as null to ensure loading state is shown
    const role = localStorage.getItem('role');
    const [error, setError] = useState('')
    const [isLoading, setIsLoaidng] = useState(false)

    const updateApplicationStatus = async (status) => {
        try {
            const response = await axiosInstance.put(`${RYI_URL}/mentor/update-application`, {
                id: applicationId,
                status: status
            });
            console.log(response);
            navigate('/mentor/application');
        } catch (error) {
            console.error('Error updating application status:', error);
        }
    };

    const fetchApplicationAPI = () => {
        axiosInstance.get(`${RYI_URL}/application/${applicationId}`)
            .then((response) => {
                console.log(response);
                setDetail(response.data.data);
            })
            .catch((err) => {
                console.error('Error fetching application details:', err);
            });
    }

    useEffect(fetchApplicationAPI, [applicationId]);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options); // Use 'en-GB' for DD-MM-YYYY format
    };

    if (!detail) {
        return <p><Spinner animation="border" style={{ width: '2rem', height: '2rem' }} />;</p>;
    }

    const handlePayment = (id, price) => {
        setIsLoaidng(true)
        axiosInstance.post(`${RYI_URL}/Payment/create-payment-url-payOs`, {
            orderCode: id,
            Description: '',
            amount: price
        })
            .then((response) => {
                console.log(response);
                if (response.data.isSuccess) {
                    setIsLoaidng(true)
                    console.log('Payment successful:', response);

                    // Navigate to the payment URL
                    window.open(response.data.data.checkoutUrl, '_blank');
                } else {
                    if (response.data.detail) {
                        setError(response.data.detail)
                        console.log('Payment Error:', response.data.detail)
                    } else {
                        console.log('Payment error:', response.data.messages[0].content);
                        setError(response.data.messages[0].content)
                    }
                }
            })
            .catch((err) => {
                console.error('Payment error:', err);

            })
            .finally(() => {
                setIsLoaidng(false)
            });
    };


    return (
        <div>
            {role === 'Mentor' ? detail.user && (
                <div className="application-detail-container">
                    <NavMentor activePage="application" />
                    <div className='application-detail' style={{ display: 'flex' }}>
                        <div className='mentee-infor-detail'>
                            <img
                                className='img-application'
                                src={detail.user.profilePic || altImg}
                                alt={detail.user.fullName || 'No Name'}
                                onError={(e) => { e.target.src = altImg; }}
                            />
                            <h2>{detail.user.fullName || 'No Name'}</h2>

                            <p><b><FontAwesomeIcon icon={faEnvelopeOpen} /></b> {detail.user.email || 'No Email'}</p>
                            <p><b>Applied Date: </b> {formatDate(detail.appliedDate)}</p>
                            {detail.status === 'PENDING' ? (
                                <div>
                                    <button className='btn-update-apllication accept' onClick={() => updateApplicationStatus('ACCEPTED')}>Accept</button>
                                    <button className='btn-update-apllication deny' onClick={() => updateApplicationStatus('DENIED')}>Deny</button>
                                </div>
                            ) : detail.status === 'ACCEPTED' ? (
                                <p className='status-accepted'>ACCEPTED</p>
                            ) : detail.status === 'DENIED' ? (
                                <p className='status-denied'>DENIED</p>
                            ) : <p className='status-paid'>PAID</p>}
                        </div>
                        <div className='mentee-detail-application'>
                            <div className='my-mentorship-plan'>
                                <h3> MentorShip Plan Booking</h3>
                                <h4>{detail.price} VND</h4>
                                <p>{detail.menteePlan?.descriptionOfPlan}</p>
                                <div style={{ marginTop: '30px' }}>
                                    <p><FontAwesomeIcon className='icon-mentorship-plan' icon={faPhoneVolume} /> {detail.menteePlan?.callPerMonth} calls per month ({detail.menteePlan?.durationOfMeeting}min/call)</p>
                                    <p><FontAwesomeIcon className='icon-mentorship-plan' icon={faComments} /> Unlimited Q&A via chat</p>
                                    <p><FontAwesomeIcon className='icon-mentorship-plan' icon={faClock} /> Remain {detail.menteePlan?.remainSlot} slots</p>
                                    <p><FontAwesomeIcon className='icon-mentorship-plan' icon={faBriefcase} /> Hands-on support</p>
                                </div>
                            </div>
                            <div className='mentee-application-answer'>
                                <h3>Mentee application answers</h3>
                                <div>
                                    {detail.menteeApplicationAnswers && detail.menteeApplicationAnswers.length ? detail.menteeApplicationAnswers.map((qa, i) => (
                                        <div className='qa-item'>
                                            <p className='question-application' >Question {i + 1}: {qa.question}</p>
                                            <p className='answer-application'> {qa.responseContent}</p>
                                        </div>
                                    )) : (<div className='no-data'><FontAwesomeIcon icon={faBomb} /> There are no answers.</div>)}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                detail.mentor && (
                    <div className="application-detail-container">
                        <NavMentee activePage="application" />
                        <div style={{ display: 'flex' }}>
                            <div className='mentee-infor-detail'>
                                <img
                                    className='img-application'
                                    src={detail.mentor.profilePic || altImg}
                                    alt={detail.mentor.fullName || 'No Name'}
                                    onError={(e) => { e.target.src = altImg; }}
                                />
                                <h2>{detail.mentor.fullName || 'No Name'}</h2>
                                <p><b><FontAwesomeIcon icon={faEnvelopeOpen} /></b> {detail.mentor.email || 'No Email'}</p>
                                <p><b>Applied Date: </b> {formatDate(detail.appliedDate)}</p>
                            </div>
                            <div className='mentee-detail-application'>
                                <div className='my-mentorship-plan'>
                                    <h3> Mentorship Plan Booking</h3>
                                    <h4>{detail.price} VND</h4>
                                    {detail.status === 'ACCEPTED' && (
                                        <button className='btn-payment' onClick={() => handlePayment(detail.id, detail.price)}>
                                            Payment
                                            {isLoading && (
                                                <Spinner animation="border" role="status" style={{ width: '1rem', height: '1rem' }}>
                                                    <span className="visually-hidden">Loading...</span>
                                                </Spinner>)}
                                        </button>

                                    )} <br />
                                    {error && <small className='error-message'>{error}</small>}
                                    <p>{detail.menteePlan?.descriptionOfPlan}</p>
                                    <div style={{ marginTop: '30px' }}>
                                        <p><FontAwesomeIcon className='icon-mentorship-plan' icon={faPhoneVolume} /> {detail.menteePlan?.callPerMonth} calls per month ({detail.menteePlan?.durationOfMeeting}min/call)</p>
                                        <p><FontAwesomeIcon className='icon-mentorship-plan' icon={faComments} /> Unlimited Q&A via chat</p>
                                        <p><FontAwesomeIcon className='icon-mentorship-plan' icon={faClock} /> Remain {detail.menteePlan?.remainSlot} slots</p>
                                        <p><FontAwesomeIcon className='icon-mentorship-plan' icon={faBriefcase} /> Hands-on support</p>
                                    </div>
                                </div>
                                <div className='mentee-application-answer'>
                                    <h3>Your application answers</h3>
                                    <div>
                                        {detail.menteeApplicationAnswers && detail.menteeApplicationAnswers.length ? detail.menteeApplicationAnswers.map((qa, i) => (
                                            <div className='qa-item'>
                                                <p className='question-application' >Question {i + 1}: {qa.question}</p>
                                                <p className='answer-application'> {qa.responseContent}</p>
                                            </div>
                                        )) : (<div className='no-data'><FontAwesomeIcon icon={faBomb} /> There are no answers.</div>)}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )
            }
            <Footer backgroundColor={'#274A79'} color={'#F9FDFF'} />
        </div >
    );
}
