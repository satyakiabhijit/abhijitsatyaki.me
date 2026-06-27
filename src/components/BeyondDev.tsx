import { useState } from "react";
import { FaCamera, FaXmark, FaChevronLeft, FaChevronRight, FaMagnifyingGlassPlus } from "react-icons/fa6";
import "./styles/BeyondDev.css";

const photos = [
  { src: "/images/photography/642010859_17915167422297482_1341316382953849925_n. (1).webp", alt: "Photography 1" },
  { src: "/images/photography/642010859_17915167422297482_1341316382953849925_n..webp", alt: "Photography 2" },
  { src: "/images/photography/642343875_17915330919297482_1273386258786589568_n..webp", alt: "Photography 3" },
  { src: "/images/photography/642548924_17915264160297482_1828720447316309028_n..webp", alt: "Photography 4" },
  { src: "/images/photography/643552071_17915020950297482_6717201457743209714_n..webp", alt: "Photography 5" },
  { src: "/images/photography/645582098_17915492580297482_1974365970628775361_n..webp", alt: "Photography 6" },
  { src: "/images/photography/648961055_17916079806297482_8885907561637934335_n..webp", alt: "Photography 7" },
];

const BeyondDev = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openPhoto = (index: number) => setSelectedIndex(index);
  const closePhoto = () => setSelectedIndex(null);
  const nextPhoto = () =>
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
  const prevPhoto = () =>
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + photos.length) % photos.length : 0
    );

  return (
    <div className="beyond-section section-container" id="beyond-dev">
      <div className="beyond-container">
        <h2>
          Through My <span>Lens</span>
          <br /> Beyond Dev
        </h2>
        
        <p className="beyond-subtitle">
          When I'm not writing code, I'm capturing moments. Photography is my creative outlet — finding beauty in the everyday through a different kind of focus.
        </p>

        <div className="beyond-grid">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className="beyond-item"
              onClick={() => openPhoto(index)}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" />
              <div className="beyond-overlay">
                <FaMagnifyingGlassPlus size={24} color="#fff" />
              </div>
            </div>
          ))}
        </div>

        <div className="beyond-stats">
          <div className="beyond-stat">
            <h3>500+</h3>
            <p>Photos Captured</p>
          </div>
          <div className="beyond-stat">
            <h3>Street & Nature</h3>
            <p>Favorite Genre</p>
          </div>
          <div className="beyond-stat">
            <h3>Smartphone</h3>
            <p>Camera</p>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="lightbox-overlay" onClick={closePhoto}>
          <button className="lightbox-close" onClick={closePhoto}>
            <FaXmark size={24} />
          </button>
          
          <button 
            className="lightbox-nav lightbox-prev" 
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
          >
            <FaChevronLeft size={24} />
          </button>
          
          <button 
            className="lightbox-nav lightbox-next" 
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
          >
            <FaChevronRight size={24} />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={photos[selectedIndex].src} 
              alt={photos[selectedIndex].alt} 
            />
            <div className="lightbox-counter">
              {selectedIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeyondDev;
