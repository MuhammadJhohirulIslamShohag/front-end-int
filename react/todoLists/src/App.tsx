import React from "react";
import "./App.css";
import TodoLists from "./pages/TodoLists/TodoLists";

/**
 * Main application component.
 * Serves as the primary layout wrapper, placing global features like
 * navigation, main content, and sidebars into structured HTML grid regions.
 */
function App() {
  return (
    // Top-level grid container wrapping the whole layout
    <div className="app">
      {/* Global Application Header */}
      <header>Header</header>

      {/* Main body area splitting layout into navigation, main, and sidebar */}
      <div className="content">
        {/* Primary Site Navigation */}
        <nav>Navigation</nav>

        {/* Core application view container */}
        <main>
          <TodoLists />
        </main>

        {/* Supplemental Sidebar */}
        <aside>Sidebar</aside>
      </div>

      {/* Global Application Footer */}
      <footer>Footer</footer>
    </div>
  );
}

export default App;
