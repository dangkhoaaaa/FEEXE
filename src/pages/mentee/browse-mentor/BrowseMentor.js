import React, { useEffect, useState } from 'react';
import "./BrowseMentor.scss";
import NavMentee from '../../../components/Nav-mentee/NavMentee';
import img from "../../../assets/image/noImage.png";
import Footer from "./../../../components/footer/Footer";
import { Link } from 'react-router-dom';
import { RYI_URL } from '../../../URL_BE/urlbackend';
import axiosInstance from '../../../service/AxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Spinner, Pagination } from 'react-bootstrap';

export default function BrowseMentor() {
    const [mentors, setMentors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize] = useState(10);
    const [isLastPage, setIsLastPage] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchMentors(pageIndex);
    }, [pageIndex]);

    const fetchMentors = (page) => {
        setIsLoading(true);
        axiosInstance.get(`${RYI_URL}/Mentor/browse-mentor`, {
            params: {
                PageSize: pageSize,
                PageIndex: page
            }
        })
            .then(response => {
                const data = response.data.data;
                setMentors(data.data);
                setIsLastPage(data.isLastPage);
                setTotalPages(data.lastPage);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the mentors!", error);
                setIsLoading(false);
            });
    };

    const handlePageChange = (page) => {
        setPageIndex(page);
    };

    return (
        <>
            <NavMentee activePage="mentors" />
            <div className='browse-mentor-container'>
                {isLoading ? (
                    <div className="spinner-container">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <div className='mentors-list-container'>
                        <h1 className='mentor-community-title'>MENTOR COMMUNITY</h1>
                        <div className='mentors-list'>
                            {mentors.map((mentor, index) => (
                                <div className='mentor-item' key={index}>
                                    <img src={mentor.profilePic || img} className='img-mentor-profile' alt='img-mentor-profile' />
                                    <div className='mentor-item-infor'>
                                        <p>{mentor.fullName}</p>
                                        <p>JOB: {mentor.jobTitle || '...'}</p>
                                        <p><FontAwesomeIcon icon={faLocationDot} /> {mentor.company || '...'}</p>
                                        <span>{mentor.bio}</span>
                                        <Link to={`/userProfile/${mentor.id}`} className='btn-view-profile'>View Profile</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination>
                            <Pagination.First onClick={() => handlePageChange(1)} disabled={pageIndex === 1} />
                            <Pagination.Prev onClick={() => handlePageChange(pageIndex - 1)} disabled={pageIndex === 1} />
                            {[...Array(totalPages)].map((_, idx) => (
                                <Pagination.Item
                                    key={idx + 1}
                                    active={idx + 1 === pageIndex}
                                    onClick={() => handlePageChange(idx + 1)}
                                >
                                    {idx + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => handlePageChange(pageIndex + 1)} disabled={isLastPage} />
                            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={isLastPage} />
                        </Pagination>
                    </div>
                )}
            </div>
            <Footer backgroundColor={"#6ADBD7"} color={'#274a79'} />
        </>
    );
}
