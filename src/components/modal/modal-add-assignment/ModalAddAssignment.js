import React, { useState } from 'react';
import './ModalAddAssignment.scss';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import axiosInstance from '../../../service/AxiosInstance';
import { RYI_URL } from '../../../URL_BE/urlbackend';
import logo from '../../../assets/logo/logo-tote.png'

export default function ModalAddAssignment({ menteeId, onClose }) {
    const [serverErrors, setServerErrors] = useState([]);
    const [formValues, setFormValues] = useState({
        title: '',
        description: '',
        deadline: '',
        file: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setFormValues({
            ...formValues,
            file: e.target.files[0],
        });
    };

    const handleSave = async () => {
        const { title, description, deadline, file } = formValues;
        const formData = new FormData();

        formData.append('Title', title);
        formData.append('Description', description);
        formData.append('Deadline', deadline);
        formData.append('File', file);
        formData.append('MenteeId', menteeId);

        try {
            axiosInstance.post(`${RYI_URL}/Workspace/mentor/create-assignment`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((response) => {
                console.log('Assignment created successfully:', response);
                // Close the modal after saving
                onClose();
            }).catch((error) => {
                console.log('Error creating assignments:', error);
                if (error.response.data.errors) {
                    setServerErrors(error.response.data.errors)
                } else {
                    setServerErrors(error.response.data)
                }

            });
        } catch (error) {
            console.error('Error creating assignment:', error);
            setServerErrors(error.response.data.errors)
        }
    };

    return (
        <Modal show={true} onHide={onClose} centered>
            <Modal.Header closeButton className='modal-header-custom'>
                <Modal.Title><img className='logo-modal' src={logo} alt='logo-tote' />Add New Assignment</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                <Form>
                    <InputGroup size="lg" className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-lg">Title</InputGroup.Text>
                        <Form.Control
                            name="title"
                            placeholder="Enter your assignment title"
                            aria-label="Title"
                            value={formValues.title}
                            onChange={handleChange}
                            aria-describedby="inputGroup-sizing-sm"
                        />
                    </InputGroup>
                    <InputGroup size="lg" className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-lg">Description</InputGroup.Text>
                        <Form.Control
                            name="description"
                            placeholder="Enter your assignment description here"
                            aria-label="Description"
                            value={formValues.description}
                            onChange={handleChange}
                            aria-describedby="inputGroup-sizing-sm"
                        />
                    </InputGroup>
                    {serverErrors.Description && <small className='error-message '>{serverErrors.Description[0]}</small>}

                    <InputGroup size="lg" >
                        <InputGroup.Text id="inputGroup-sizing-lg">Deadline</InputGroup.Text>
                        <Form.Control
                            type="datetime-local"
                            name="deadline"
                            aria-label="Deadline"
                            value={formValues.deadline}
                            onChange={handleChange}
                            aria-describedby="inputGroup-sizing-sm"
                        />


                    </InputGroup>
                    {serverErrors.Deadline && <small className='error-message '>{serverErrors.Deadline[0]}</small>}
                    <Form.Group controlId="formFile" className="mb-3 upload-ass-file">
                        <Form.Label>Upload Assignment File</Form.Label>
                        <Form.Control
                            type="file"
                            name="file"
                            onChange={handleFileChange}
                            size="lg"
                        />
                    </Form.Group>
                </Form>
                {serverErrors.detail && <small className='error-message'>{serverErrors.detail}</small>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    ADD Assignment
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
