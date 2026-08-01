import React, { useState } from "react";
import type { Tab } from "../../types/Tabs.type";
import { INITIAL_TABS } from "../../data/tabs";

/**
 * Tabs Component
 * Displays a tabbed interface adhering to WAI-ARIA standards for accessibility.
 */
const Tabs: React.FC<{ items?: Tab[] }> = ({ items = INITIAL_TABS }) => {
  // Safely initialize active tab ID to the first item's ID, falling back to null if items array is empty
  const [activeTabId, setActiveTabId] = useState<number | null>(
    () => items[0]?.id ?? null,
  );

  // Derive the active tab object; type will correctly resolve to 'Tab | undefined'
  const activeTab: Tab | undefined = items.find(
    (tab) => tab.id === activeTabId,
  );

  /**
   * Handles keyboard navigation (Arrow keys, Home, End) according to WAI-ARIA tab list guidelines.
   *
   * @param e - The keyboard event triggered on a tab button
   * @param currentTabIndex - The 0-based index of the currently focused tab in the array
   */
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    currentTabIndex: number,
  ) => {
    if (!items.length) return;

    let nextIndex = currentTabIndex;

    // Determine target index based on key pressed
    if (e.key === "ArrowRight") {
      nextIndex = (nextIndex + 1) % items.length; // Wrap around to first tab
    } else if (e.key === "ArrowLeft") {
      nextIndex = (nextIndex - 1 + items.length) % items.length; // Wrap around to last tab
    } else if (e.key === "Home") {
      nextIndex = 0; // Jump to first tab
    } else if (e.key === "End") {
      nextIndex = items.length - 1; // Jump to last tab
    } else {
      // Exit early for standard focus keys (Tab, Enter, Space) to preserve default behavior
      return;
    }

    // Intercept event only for handled navigation keys to avoid unwanted scrolling
    e.preventDefault();

    const nextTab = items[nextIndex];
    setActiveTabId(nextTab.id);

    // Programmatically transfer DOM focus to the new tab button
    const nextTabButton = document.getElementById(`tab-btn-${nextTab.id}`);
    nextTabButton?.focus();
  };

  return (
    <div>
      {/* Container for tab buttons labeled as a tablist for assistive technologies */}
      <div role="tablist" aria-label="Content Tabs">
        {items.map((tab, index) => {
          // Strict equality check for active state
          const isActive = tab.id === activeTabId;

          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              role="tab"
              // ARIA attributes for screen readers to convey selected state & relationships
              aria-selected={isActive}
              aria-controls={`tab-panel-${tab.id}`}
              // Controls keyboard focus flow: active tab gets focus (0), inactive tabs are bypassed (-1)
              tabIndex={isActive ? 0 : -1}
              style={{
                backgroundColor: isActive ? "#000080" : "#fff",
                color: isActive ? "#fff" : "#000",
                padding: "8px 16px",
                cursor: "pointer",
              }}
              onClick={() => setActiveTabId(tab.id)}
              // Pass current array index (not tab.id) to handle keyboard math correctly
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tab panel container displaying active content */}
      <div
        role="tabpanel"
        id={`tab-panel-${activeTab?.id ?? ""}`}
        aria-labelledby={`tab-btn-${activeTab?.id ?? ""}`}
        tabIndex={0} // Allows screen readers and keyboard users to focus panel content
      >
        {activeTab && <p key={activeTab.id}>{activeTab.text}</p>}
      </div>
    </div>
  );
};

export default Tabs;
