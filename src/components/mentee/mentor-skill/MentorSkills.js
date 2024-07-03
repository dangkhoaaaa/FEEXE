import React from "react";
import "./MentorSkill.scss";

export default function SkillsList({ skills, skillTitle }) {
  const displayedSkills = skills ? skills.slice(0, 4) : [];
  const remainingSkillsCount = skills ? skills.length - 4 : 0;

  return (
    <div className="mentor-skill-container">
      {skillTitle ? skillTitle : <p className="skill-title">Skills</p>}

      <div className="skill-list">
        {displayedSkills.length > 0 ? (
          <>
            {displayedSkills.map((skill, index) => (
              <span key={index} className="skill-item">
                {skill.skillName}
              </span>
            ))}
            {remainingSkillsCount > 0 && (
              <span className="skill-item">+{remainingSkillsCount}</span>
            )}
          </>
        ) : (
          <div>No skills available</div>
        )}
      </div>
    </div>
  );
}
