import React, { useEffect, useState } from 'react';
import "./Notification.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import NavMentor from '../../../components/Nav-mentor/NavMentor';
import NavMentee from '../../../components/Nav-mentee/NavMentee';
import NavStaff from '../../../components/Nav-staff/NavStaff';
import axiosInstance from '../../../service/AxiosInstance';
import { RYI_URL } from '../../../URL_BE/urlbackend';
import { Spinner, Pagination } from 'react-bootstrap';
import altImg from '../../../assets/image/noImage.png'

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
        date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
        date.getSeconds()
    ).padStart(2, "0")}`;
};

export default function Notification() {
    const role = localStorage.getItem('role');
    const [notis, setNotis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const getNotifications = (pageIndex) => {
        setIsLoading(true);
        axiosInstance.get(`${RYI_URL}/Notifications?PageSize=${pageSize}&PageIndex=${pageIndex}`)
            .then((response) => {
                console.log('noti', response);
                setNotis(response.data.data.data);
                setTotalPages(response.data.data.lastPage);
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getNotifications(pageIndex);
    }, [pageIndex]);

    const handlePageChange = (newPageIndex) => {
        setPageIndex(newPageIndex);
    };

    return (
        <div>
            {role === 'Mentor' ? (
                <NavMentor />
            ) : role === 'Mentee' ? (
                <NavMentee />
            ) : <NavStaff />}
            <div className='notification-container'>
                <div className='notification-list'>
                    {isLoading ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : (
                        notis && notis.map((noti, index) => (
                            <div className='notification' key={index}>
                                <div className='index-noti'>{index + 1 + (pageIndex - 1) * pageSize}</div>
                                <div className='noti-item'>
                                    {/* <FontAwesomeIcon className='icon-noti' icon={faBell} size='2x' /> */}
                                    <img className='img-noti' src={noti.senderAvatar ? noti.senderAvatar : altImg} />
                                    <div>
                                        <strong>{noti.content}</strong><br />
                                        <small className='noti-time'>{formatDate(noti.createdDate)}</small>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <Pagination>
                    <Pagination.First onClick={() => handlePageChange(1)} disabled={pageIndex === 1} />
                    <Pagination.Prev onClick={() => handlePageChange(pageIndex - 1)} disabled={pageIndex === 1} />
                    {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item key={i + 1} active={i + 1 === pageIndex} onClick={() => handlePageChange(i + 1)}>
                            {i + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(pageIndex + 1)} disabled={pageIndex === totalPages} />
                    <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={pageIndex === totalPages} />
                </Pagination>
            </div>
        </div>
    );
}
