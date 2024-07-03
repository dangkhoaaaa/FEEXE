import React, { useState } from 'react';
import './ModalGrade.scss';
import { Form, InputGroup, Modal, Button } from 'react-bootstrap';
import axiosInstance from '../../../service/AxiosInstance';
import { RYI_URL } from '../../../URL_BE/urlbackend';

export default function ModalGrade({ submissionId, onClose }) {
    const [grade, setGrade] = useState('');
    const [comment, setComment] = useState('');

    const handleSave = () => {
        const data = {
            id: submissionId,
            commentOfMentor: comment,
            grade: grade
        };

        axiosInstance.put(`${RYI_URL}/Workspace/mentor/grade`, data)
            .then(response => {
                console.log('Grade submitted successfully:', response);
                alert('Grade submitted successfully!');
                onClose();
            })
            .catch(error => {
                console.log('Error submitting grade:', error);
                alert('Error submitting grade.');
            });
    };

    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Grade Submission</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-default">Grade:</InputGroup.Text>
                    <Form.Control
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-default">Comment:</InputGroup.Text>
                    <Form.Control
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={handleSave}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}
