import { useState } from "react";
import { images } from "../../data/images.data";
import "./ImageCarousel.css";

/**
 * Maximum number of pagination indicator dots visible at any given time.
 * Prevents UI layout overflow when handling large datasets (e.g., 500+ items).
 */
const MAX_VISIBLE_DOTS = 5;

/**
 * ImageCarousel Component
 *
 * Displays a single dynamic image at a time with circular navigation controls
 * and a sliding-window pagination system for indicator dots.
 */
const ImageCarousel = () => {
  // Track the absolute index of the currently displayed image
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = images.length;

  /**
   * Navigates to the previous image with circular wrapping.
   * If at the first image (index 0), wraps around to the last image.
   */
  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1,
    );
  };

  /**
   * Navigates to the next image with circular wrapping.
   * If at the last image, wraps around back to the start (index 0).
   */
  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalImages - 1 ? 0 : prevIndex + 1,
    );
  };

  /**
   * Calculates the boundary indices (`start` and `end`) for slicing a 5-dot window
   * from the total images array, keeping the current active dot centered.
   *
   * @returns {{ start: number, end: number }} Boundary object for Array.prototype.slice
   */
  const getVisibleDotsRange = () => {
    // If total images fit within the maximum allowed, display all dots
    if (totalImages <= MAX_VISIBLE_DOTS) {
      return { start: 0, end: totalImages };
    }

    const halfVisible = Math.floor(MAX_VISIBLE_DOTS / 2); // 2 dots on each side
    let start = currentIndex - halfVisible;
    let end = start + MAX_VISIBLE_DOTS;

    // Boundary Constraint 1: Lock to start if window goes negative
    if (start < 0) {
      start = 0;
      end = MAX_VISIBLE_DOTS;
    }
    // Boundary Constraint 2: Lock to end if window exceeds array bounds
    else if (end > totalImages) {
      end = totalImages;
      start = totalImages - MAX_VISIBLE_DOTS;
    }

    return { start, end };
  };

  // Derive target image metadata and sliced indicator array for current render
  const currentImage = images[currentIndex];
  const { start, end } = getVisibleDotsRange();
  const visibleDots = images.slice(start, end);

  return (
    <div className="carousel-container">
      {/* Viewer Frame: Holds single DOM image element and overlay nav buttons */}
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

        {/* Navigation Controls */}
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

      {/* Pagination Bar: Renders maximum of 5 dynamic indicator dots */}
      <div className="carousel-indicators">
        {visibleDots.map((_, index) => {
          // Map relative window index (0..4) back to absolute array index
          const dotIndex = start + index;
          const isActive = dotIndex === currentIndex;

          return (
            <button
              /*
               * KEYING STRATEGY: Keying by relative visual position (`index`, 0 to 4)
               * forces React to evaluate button active states correctly as the window
               * slides over different indices.
               */
              key={index}
              className={`indicator-button ${isActive ? "active" : ""}`}
              onClick={() => setCurrentIndex(dotIndex)}
              aria-label={`Go to image ${dotIndex + 1}`}
              aria-current={isActive ? "true" : "false"}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ImageCarousel;
