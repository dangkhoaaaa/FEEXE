import React, { useEffect, useState } from 'react';
import './AssignmentDetail.scss';
import NavMentee from '../../../components/Nav-mentee/NavMentee';
import Footer from '../../../components/footer/Footer';
import axiosInstance from '../../../service/AxiosInstance';
import { RYI_URL } from '../../../URL_BE/urlbackend';
import { useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';
import ListGroup from 'react-bootstrap/ListGroup';
import NavMentor from '../../../components/Nav-mentor/NavMentor';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import ModalGrade from '../../../components/modal/modal-grade/ModalGrade';

export default function AssignmentDetail() {
    const [assignment, setAssignment] = useState({});
    const [file, setFile] = useState(null);
    const { assignmentId } = useParams();
    const role = localStorage.getItem('role');
    const [showGrade, setShowGrade] = useState(false);
    const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);

    const fetchAssignmentAPI = () => {
        axiosInstance.get(`${RYI_URL}/Workspace/assignments/${assignmentId}`)
            .then((response) => {
                console.log('assignment detail: ', response);
                setAssignment(response.data.data);
            })
            .catch((error) => {
                console.log('Error on get assignment detail', error);
            });
    };

    useEffect(fetchAssignmentAPI, [assignmentId]);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options); // Use 'en-GB' for DD-MM-YYYY format
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = () => {
        if (!file) {
            alert('Please select a file to submit.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('assignmentId', assignment.id);

        axiosInstance.post(`${RYI_URL}/Workspace/mentee/submit`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                console.log('File submitted successfully:', response);
                alert('File submitted successfully!');
                fetchAssignmentAPI();
            })
            .catch((error) => {
                console.log('Error submitting file:', error);
                alert('Error submitting file.');
            });
    };

    const handleShowGradeModal = (submissionId) => {
        setSelectedSubmissionId(submissionId);
        setShowGrade(true);
    };

    const handleCloseGradeModal = () => {
        setShowGrade(false);
        setSelectedSubmissionId(null);
        fetchAssignmentAPI()

    };

    return (
        <div>
            {role === 'Mentor' ? (
                <NavMentor activePage="workspace" />
            ) : (
                <NavMentee activePage="workspace" />
            )}

            <div className='assignment-detail-container'>
                <h2 className='assign-title'>Title: {assignment.title}</h2>
                <div className='assignment-detail'>
                    <div className='assignment-author'>
                        <div><b>Assigned by: </b>{assignment.mentor}</div>
                        {assignment.mentee && (
                            <div><b>Assigned to: </b>{assignment.mentee?.fullName}</div>
                        )}
                    </div>
                    <div className='assignment-infor'>
                        <ListGroup>
                            <ListGroup.Item ><b>Description:</b> {assignment.description}</ListGroup.Item>
                            <ListGroup.Item><b>Assigned Date:</b> {formatDate(assignment.assignedDate)}</ListGroup.Item>
                            <ListGroup.Item><b>Deadline:</b> {formatDate(assignment.deadline)}</ListGroup.Item>
                            <ListGroup.Item><b>File:</b>
                                <a className='download-file' href={assignment.file} target="_blank" rel="noopener noreferrer">
                                    Download file <FontAwesomeIcon icon={faCloudArrowDown} />
                                </a>
                            </ListGroup.Item>
                        </ListGroup>
                    </div>
                </div>
                <div className='submission-container'>
                    {role === 'Mentor' ? (
                        <></>
                    ) : (
                        <Form.Group controlId="formFileLg" className="mb-3 add-submission-container">
                            <Form.Label><b>Add Submission</b></Form.Label>
                            <Form.Control type="file" size="lg" onChange={handleFileChange} />
                            <Button className='btn-add-submission' onClick={handleSubmit}>Add</Button>
                        </Form.Group>
                    )}

                    <div className='submissions-list-container'>
                        <h3>Submissions List</h3>
                        {assignment.mentee && (
                            <p className='submission-item-mentee-name'><b>Submitted by: </b>{assignment.mentee.fullName}</p>
                        )}
                        <div className='submissions-list'>
                            {assignment.submissions && assignment.submissions.length ? (
                                assignment.submissions.map((sub) => (
                                    <div className='submission-item' key={sub.id}>
                                        <p>
                                            <a className='download-file' href={sub.file} target="_blank" rel="noopener noreferrer">File Submitted <FontAwesomeIcon icon={faCloudArrowDown} /></a>
                                        </p>
                                        <ListGroup className='list-submitted-info'>
                                            <ListGroup.Item><b>Submitted Date:</b> {formatDate(sub.submittedDate)}</ListGroup.Item>
                                            <ListGroup.Item ><b>Grade:</b> {sub.grade}</ListGroup.Item>
                                            <ListGroup.Item ><b>Submission Status:</b> <span className={sub.status === 'UNGRADED' ? 'ungraded' : 'graded'}>{sub.status}</span></ListGroup.Item>
                                            {sub.commentOfMentor ? <ListGroup.Item ><b>Mentor's comment:</b> {sub.commentOfMentor}</ListGroup.Item> : <></>}
                                            {role === 'Mentor' && (
                                                <ListGroup.Item>
                                                    <button className='btn-grade' onClick={() => handleShowGradeModal(sub.id)}>
                                                        <FontAwesomeIcon icon={faPenToSquare} /> Grade
                                                    </button>
                                                </ListGroup.Item>
                                            )}
                                        </ListGroup>
                                    </div>
                                ))
                            ) : (<div className='no-data'><FontAwesomeIcon icon={faCircleExclamation} /> There are no submissions....</div>)}
                        </div>
                    </div>
                </div>
            </div>
            {showGrade && <ModalGrade submissionId={selectedSubmissionId} onClose={handleCloseGradeModal} />}
            <Footer backgroundColor={'#274A79'} color={'#F9FDFF'} />
        </div>
    );
}
