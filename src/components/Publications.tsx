import { config } from "../config";
import "./styles/Publications.css";

const Publications = () => {
  return (
    <div className="publications-section section-container" id="publications">
      <div className="publications-container">
        <h2>
          My <span>Research</span>
          <br /> Publications
        </h2>
        
        <div className="publications-grid">
          {config.publications.map((pub, index) => (
            <div className="publication-card" key={index}>
              <div className="publication-header">
                <span className="publication-status">{pub.status}</span>
                <span className="publication-year">{pub.year}</span>
              </div>
              <h3 className="publication-title">{pub.title}</h3>
              <h4 className="publication-venue">{pub.venue}</h4>
              <p className="publication-desc">{pub.description}</p>
              
              <div className="publication-tags">
                {pub.tags.map((tag, i) => (
                  <span key={i} className="publication-tag">{tag}</span>
                ))}
              </div>
              
              {pub.link && (
                <a href={pub.link} target="_blank" rel="noreferrer" className="publication-link" data-cursor="disable">
                  View Publication →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Publications;
