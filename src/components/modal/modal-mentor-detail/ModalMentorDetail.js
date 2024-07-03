import React, { useEffect, useState } from 'react';
import './ModalMentorDetail.scss';
import { Button, Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { RYI_URL } from '../../../URL_BE/urlbackend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../../service/AxiosInstance';

function ModalMentorDetail({ id, onClose }) {

    const [mentorDetail, setMentorDetail] = useState(null);

    useEffect(() => {
        axiosInstance.get(`${RYI_URL}/MentorApplication/${id}`)
            .then(response => {
                setMentorDetail(response.data.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the mentor details!", error);
            });
    }, [id]);



    const updateStatus = (newStatus) => {
        axiosInstance.put(`${RYI_URL}/MentorApplication/${id}?status=${newStatus}`)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error("There was an error updating the mentor status!", error);
            });
    };


    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options); // Use 'en-GB' for DD-MM-YYYY format
    };

    if (!mentorDetail) {
        return <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    }

    const handleAccept = () => {
        updateStatus('ACCEPTED');
        onClose(); // Đóng modal sau khi xử lý sự kiện Accept
    };

    const handleDeny = () => {
        updateStatus('DENIED');
        onClose(); // Đóng modal sau khi xử lý sự kiện Deny
    };

    return (
        <Modal className='modal-detail-container' show={true} onHide={onClose}>
            <Modal.Header className='modal-detail-header' closeButton >
                <Modal.Title>{mentorDetail.fullName} {mentorDetail.status === 0 && (<span style={{ color: 'yellow' }}>(Pending)</span>)}
                    {mentorDetail.status === 1 && (<span style={{ color: 'green' }}>(Accepted)</span>)}
                    {mentorDetail.status === 2 && (<span style={{ color: 'red' }}>(Denied)</span>)}

                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='modal-detail-body'>
                <div className='mentor-contact'>
                    <h3>Contact</h3>
                    <p><strong>Full name:</strong> {mentorDetail.fullName}</p>
                    <p><strong>Email:</strong> {mentorDetail.email}</p>
                    <p><strong>Phone Number:</strong> {mentorDetail.phoneNumber}</p>
                </div>
                <div className='mentor-information'>
                    <h3>Information</h3>
                    <p><strong>Job title:</strong> {mentorDetail.jobTitle}</p>
                    <p><strong>Category:</strong> {mentorDetail.category}</p>
                    <p><strong>Company :</strong> {mentorDetail.company}</p>
                    <p><strong>Bio :</strong> {mentorDetail.bio}</p>
                </div>
                <div className='mentor-answer'>
                    <h3>Answer question:</h3>
                    <p><strong>Why do you want to become a mentor?</strong> {mentorDetail.reason}</p>
                    <p><strong>What, in your opinion, has been your greatest achievement so far?</strong> {mentorDetail.achievement}</p>
                </div>
                <p className='mentor-cv-download'><strong>CV:</strong> <a className='download-cv' href={mentorDetail.cv} target="_blank" rel="noopener noreferrer">Download CV <FontAwesomeIcon icon={faCloudArrowDown} /></a></p>
                {mentorDetail.status === 0 && (
                    <div className='btn-approve-container'>
                        <h3>CV approval</h3>
                        <p><strong>Applied Date:</strong> {formatDate(mentorDetail.appliedDate)}</p>
                        <Button className='btn-approve accept' onClick={handleAccept}>Accept</Button>
                        <Button className='btn-approve deny' onClick={handleDeny}>Deny</Button>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
}

export default ModalMentorDetail;
