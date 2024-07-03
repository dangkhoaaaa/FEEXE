import React, { useState, useEffect } from 'react';
import './SkillInputTag.scss';
import axiosInstance from '../../service/AxiosInstance';
import { RYI_URL } from '../../URL_BE/urlbackend';

export default function SkillInputTag() {
    const [inputValue, setInputValue] = useState('');
    const [fetchedSkills, setFetchedSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (inputValue) {
            axiosInstance.get(`${RYI_URL}/Skill`, { params: { search: inputValue } })
                .then(response => {
                    setFetchedSkills(response.data.data);
                    console.log(response)
                })
                .catch(error => {
                    console.error("There was an error fetching the skills!", error);
                });
        } else {
            setFetchedSkills([]);
        }
    }, [inputValue]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        setSuccess(false)
    };

    const handleSkillClick = (skill) => {
        console.log(skill)
        if (!selectedSkills.some(selected => selected.id === skill.id)) {
            setSelectedSkills([...selectedSkills, skill]);
            setInputValue('');
            setFetchedSkills([]);
        }
    };

    const handleRemoveSkill = (skillId) => {
        setSelectedSkills(selectedSkills.filter(skill => skill.id !== skillId));
    };

    const handleUpdateSkills = () => {
        const skillIds = selectedSkills.map(skill => ({ id: skill.id }));
        axiosInstance.put(`${RYI_URL}/Skill/update-my-skill`, { skills: skillIds })
            .then(response => {
                console.log("Skills updated successfully", response);
                setSuccess(true)
                setSelectedSkills([])
            })
            .catch(error => {
                console.error("There was an error updating the skills!", error);
            });
    };

    return (
        <div className="skill-input-tag-container">
            <div className="selected-skills">
                {selectedSkills.map(skill => (
                    <div key={skill.id} className="skill-tag">
                        {skill.skillName}
                        <button onClick={() => handleRemoveSkill(skill.id)}>x</button>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type to search for skills..."
            />
            {fetchedSkills.length > 0 && (
                <div className="skills-dropdown">
                    {fetchedSkills.map(skill => (
                        <div
                            key={skill.id}
                            className="skill-item-search"
                            onClick={() => handleSkillClick(skill)}
                        >
                            {skill.skillName}
                        </div>
                    ))}
                </div>
            )}
            <br />
            {success ? <p className='update-success'>Update successFully!</p> : ''}
            <button className='btn-update-skill' onClick={handleUpdateSkills}>Update Skills</button>
        </div>
    );
}
