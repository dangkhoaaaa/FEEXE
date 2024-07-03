import React, { useEffect, useState } from 'react';
import './ApplyQuestion.scss';
import NavMentee from '../../../../components/Nav-mentee/NavMentee';
import Footer from '../../../../components/footer/Footer';
import axiosInstance from '../../../../service/AxiosInstance';
import { RYI_URL } from '../../../../URL_BE/urlbackend';
import { useNavigate, useParams } from 'react-router-dom';

export default function ApplyQuestion() {
    const { mentorshipPlan } = useParams();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const navigate = useNavigate();

    const fetchAPI = () => {
        axiosInstance.get(`${RYI_URL}/ApplicationQuestion`)
            .then(response => {
                const questionsData = response.data.data;
                setQuestions(questionsData);
                setAnswers(questionsData.map(question => ({ questionId: question.id, responseContent: '' })));
            })
            .catch(error => {
                console.error("There was an error fetching questions!", error);
            });
    };

    useEffect(fetchAPI, []);

    const handleInputChange = (index, event) => {
        const newAnswers = [...answers];
        newAnswers[index] = {
            questionId: questions[index].id,
            responseContent: event.target.value
        };
        setAnswers(newAnswers);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const payload = {
            menteePlanId: mentorshipPlan,
            menteeApplicationAnswers: answers
        };

        axiosInstance.post(`${RYI_URL}/mentee/apply`, payload)
            .then(response => {
                console.log(response)
                console.log(payload)
                if (response.data.isSuccess) {
                    console.log('Application submitted:', response.data);
                    navigate('/mentee/application')
                } else {
                    console.error("There was an error submitting the application!", response.data.messages[0].content);
                }
            })
            .catch(error => {
                console.error("There was an error submitting the application!", error);
            });
    };

    return (
        <div>
            <NavMentee activePage="mentors" />
            <form className='apply-question-container' onSubmit={handleSubmit}>
                <h2 className='apply-title'>
                    Please answer some questions to confirm your application.
                </h2>

                <div className='questions-container'>
                    {questions.map((question, i) => (
                        <div key={question.id} className='input-field question'>
                            <label>{i + 1}. {question.content}</label>
                            <textarea
                                value={answers[i].responseContent}
                                onChange={(e) => handleInputChange(i, e)}
                            />
                        </div>
                    ))}
                    <button type='submit' className='btn-submit-answer'>Submit</button>
                </div>
            </form>
            <Footer backgroundColor={'#274A79'} color={'#F9FDFF'} />
        </div>
    );
}
