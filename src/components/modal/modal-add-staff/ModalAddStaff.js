import React, { useState } from 'react'
import './ModalAddStaff.scss'
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import axiosInstance from '../../../service/AxiosInstance';
import { RYI_URL } from '../../../URL_BE/urlbackend';

export default function ModalAddStaff({ onClose }) {
    const [userName, setUserName] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errors, setErrors] = useState({});



    const handleAddStaff = () => {
        const data = {
            username: userName,
            fullName: fullName,
            phoneNumber: phoneNumber
        }
        axiosInstance.post(`${RYI_URL}/Admin/staff-creation`, data).then((res) => {
            console.log(res);
            onClose()
        })
            .catch((err) => {
                console.log(err.response.data);
                setErrors(err.response.data.errors)
            })

    }



    return (
        <Modal show onHide={onClose}>
            <Modal.Header className='header-add-staff' closeButton>
                <Modal.Title>Add NEW STAFF</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3 userName-input ">
                    <InputGroup.Text id="inputGroup-sizing-default">User Name:</InputGroup.Text>
                    <Form.Control
                        aria-label="Default"
                        className='input-add-staff'
                        aria-describedby="inputGroup-sizing-default"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </InputGroup>
                {/* {errors.Username && <small className='error-message add-staff'>{errors.Username[0]}</small>} */}
                <InputGroup className="mb-3 fullName-input">
                    <InputGroup.Text id="inputGroup-sizing-default">Full Name:</InputGroup.Text>
                    <Form.Control
                        aria-label="Default"
                        className='input-add-staff'
                        aria-describedby="inputGroup-sizing-default"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </InputGroup>
                {/* {errors.FullName && <small className='error-message add-staff'>{errors.FullName[0]}</small>} */}

                <InputGroup className="mb-3 phone-input">
                    <InputGroup.Text id="inputGroup-sizing-default">Phone Number:</InputGroup.Text>
                    <Form.Control
                        aria-label="Default"
                        className='input-add-staff'
                        aria-describedby="inputGroup-sizing-default"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </InputGroup>
                {errors.PhoneNumber && <small className='error-message add-staff'>{errors.PhoneNumber[0]}</small>}

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={handleAddStaff}>Add</Button>
            </Modal.Footer>
        </Modal>
    );
}
