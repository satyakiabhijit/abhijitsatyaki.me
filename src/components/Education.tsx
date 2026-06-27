import "./styles/Career.css";
import { config } from "../config";

const Education = () => {
  return (
    <div id="education" className="career-section section-container">
      <div className="career-container">
        <h2>
          My <span>Academic</span>
          <br /> Background
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {config.education.map((edu, index) => (
            <div key={index} className="career-info-box">
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{edu.title}</h4>
                  <h5>{edu.institution}</h5>
                  <span style={{ fontSize: "14px", color: "#aaa" }}>{edu.location}</span>
                </div>
                <h3>{edu.period}</h3>
              </div>
              <p>{edu.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Education;
