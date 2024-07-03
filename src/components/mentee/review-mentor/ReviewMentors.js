import React, { useEffect, useState } from 'react';
import './ReviewMentor.scss';
import img from '../../../assets/image/noImage.png';
import axiosInstance from '../../../service/AxiosInstance';
import { RYI_URL } from '../../../URL_BE/urlbackend';
import StarRatingComponent from 'react-star-rating-component';

export default function ReviewMentors({ mentorId }) {
    const [feedbacks, setFeedbacks] = useState([]);

    const fetchFeedbackApi = () => {
        axiosInstance.get(`${RYI_URL}/Feedback/${mentorId}?PageIndex=1&&PageSize=100`)
            .then((res) => {
                console.log(res);
                setFeedbacks(res.data.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchFeedbackApi();
    }, [mentorId]);

    // Data fixed cứng for testing
    const fixedFeedback = {
        name: "Luis",
        date: "2023-06-21",
        rating: 4, // Xếp hạng sao từ 1 đến 5
        comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    };

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

    return (
        <div className='review-mentor-container'>
            <h2 className='review-title'>What mentees say</h2>
            <div className='review-mentor-list'>
                {feedbacks.length > 0 ? (
                    feedbacks.map((feedback, index) => (
                        <div key={index} className='review-mentor-item'>
                            <div className='mentee-review-infor-container'>
                                <img className='mentee-review-img' src={img} alt="Mentee" />
                                <div className='mentee-review-infor'>
                                    <div style={{ display: 'flex' }}>
                                        <h4>{feedback.createdUserName}</h4>
                                        <StarRatingComponent
                                            name={`rate${index}`}
                                            starCount={5}
                                            value={feedback.rating}
                                            editing={false}
                                            starColor="#ffd700"
                                            emptyStarColor="#ccc"
                                            className='star-rating'
                                        />
                                    </div>
                                    <div style={{ marginRight: '20px' }}>{formatDate(feedback.createdDate)}</div>
                                </div>
                            </div>
                            <p className='mentee-review-content'>
                                Mentor is very dedicated and very good. <br />
                                {feedback.comment}
                            </p>
                        </div>
                    ))
                ) : (<div>No feedback available</div>)}
            </div>
        </div>
    );
}
