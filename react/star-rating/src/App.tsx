import { useState } from "react";
import "./App.css";
import StarRating from "./pages/StarRating/StarRating";

/**
 * Main application component serving as the root container.
 * Demonstrates the controlled usage of the StarRating component.
 */
function App() {
  // Tracks the currently selected star rating value (defaults to 0 / unrated)
  const [rating, setRating] = useState<number>(0);

  return (
    // Centered layout container for displaying the widget
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Controlled Star Rating Widget instance */}
      <StarRating max={5} value={rating} onChange={setRating} />
    </div>
  );
}

export default App;