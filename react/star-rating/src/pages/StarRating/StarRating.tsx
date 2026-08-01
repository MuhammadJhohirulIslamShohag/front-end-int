import { useState } from "react";
import StarIcon from "../../components/Shared/StarIcon/StarIcon";

/**
 * Props for the StarRating component.
 */
interface StarRatingProps {
  /** Maximum number of stars to display in the widget */
  max: number;
  /** Currently selected rating value */
  value: number;
  /** Callback triggered when a user clicks on a star to set a new rating */
  onChange: (value: number) => void;
}

/**
 * A reusable Star Rating component that allows users to interactively
 * select a rating value with hover feedback and keyboard accessibility.
 */
const StarRating = ({
  max = 5,
  value = 0,
  onChange = () => {},
}: StarRatingProps) => {
  // Tracks the index of the star currently being hovered (null when cursor leaves)
  const [hovered, setHovered] = useState<number | null>(null);

  // Active rating prioritizes hover state over the saved value
  const activeRating = hovered !== null ? hovered : value;

  return (
    <div>
      {/* Container holding the row of interactive stars */}
      <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const isFilled = activeRating >= starValue;

          return (
            <div
              key={index}
              onMouseEnter={() => setHovered(starValue)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onChange(starValue)}
              style={{ cursor: "pointer" }}
            >
              {/* Renders filled or outline SVG depending on the star position */}
              <StarIcon isFilled={isFilled} />
            </div>
          );
        })}
      </div>

      {/* Display label for the current rating or hover state */}
      <div>
        <p style={{ marginTop: "10px", display: "block" }}>
          Current Rating: {activeRating}
        </p>
      </div>
    </div>
  );
};

export default StarRating;
