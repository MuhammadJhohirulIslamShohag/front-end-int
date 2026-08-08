import { useState } from "react";
import { images } from "../../data/images.data";
import "./ImageCarousel.css";

const MAX_VISIBLE_DOTS = 5;

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = images.length;

  // Clean circular navigation using modulo arithmetic
  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  
  const getVisibleDotsRange = () => {
    if (totalImages <= MAX_VISIBLE_DOTS) {
      return { start: 0, end: totalImages };
    }

    const halfVisible = Math.floor(MAX_VISIBLE_DOTS / 2); // 2
    let start = currentIndex - halfVisible;
    let end = start + MAX_VISIBLE_DOTS;

    if (start < 0) {
      start = 0;
      end = MAX_VISIBLE_DOTS;
    } else if (end > totalImages) {
      end = totalImages;
      start = totalImages - MAX_VISIBLE_DOTS;
    }

    return { start, end };
  };

  const currentImage = images[currentIndex];
  const { start, end } = getVisibleDotsRange();
  const visibleDots = images.slice(start, end);

  return (
    <div className="carousel-container">
      <div className="carousel-viewer">
        {currentImage ? (
          <img
            className="carousel-image"
            src={currentImage.src}
            alt={currentImage.alt}
          />
        ) : (
          <img className="carousel-image" src="" alt="No image available" />
        )}

        <button
          className="nav-btn prev-button"
          onClick={handlePrevClick}
          aria-label="Previous Image"
        >
          Previous
        </button>
        <button
          className="nav-btn next-button"
          onClick={handleNextClick}
          aria-label="Next Image"
        >
          Next
        </button>
      </div>

      <div className="carousel-indicators">
        {visibleDots.map((_, index) => {
          const dotIndex = start + index;
          const isActive = dotIndex === currentIndex;

          return (
            <button
              // Keying by the relative position (0 to 4) ensures
              // React updates active states correctly when the window slides.
              key={index}
              className={`indicator-button ${isActive ? "active" : ""}`}
              onClick={() => setCurrentIndex(dotIndex)}
              aria-label={`Go to image ${dotIndex + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ImageCarousel;
