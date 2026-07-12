import React from "react";
import type { ExplorerItem } from "../types/ExplorerItem.type";

/**
 * Props for the Folder component.
 */
interface FolderProps {
  /** The current file or folder node metadata */
  item: ExplorerItem;
  /** Callback triggered to bubble up and insert a new node into the file tree state */
  handleAddNewNode: (
    folderId: string,
    itemName: string,
    isFolder: boolean,
  ) => void;
}

/**
 * State shape determining if the contextual inline text input
 * for creating a new file or folder is visible.
 */
interface ShowInputState {
  visible: boolean;
  isFolder: boolean | null;
}

const Folder: React.FC<FolderProps> = ({ item, handleAddNewNode }) => {
  // Toggles the visibility of the folder's nested contents (children)
  const [expanded, setExpanded] = React.useState(false);

  // Controls the appearance and variant (file vs folder) of the creation input field
  const [isShowInput, setIsShowInput] = React.useState<ShowInputState>({
    visible: false,
    isFolder: null,
  });

  /**
   * Prepares the component UI to accept a new child node name.
   * Forces the current folder to expand and reveals the input element.
   */
  const handleNewFolder = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    isFolder: boolean = false,
  ) => {
    e.stopPropagation(); // Prevents collapsing/expanding the parent folder when clicking buttons
    setExpanded(true); // Automatically open the folder to reveal the newly emerging input field
    setIsShowInput({
      visible: true,
      isFolder: isFolder,
    });
  };

  /**
   * Evaluates keypress triggers within the creation input.
   * If 'Enter' is pressed and valid text is provided, bubbles the creation request upwards.
   */
  const handleAddNewFolder = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check both event properties for cross-browser safety when assessing the Enter key
    if (e.key === "Enter" || e.keyCode === 13) {
      const inputValue = (e.target as HTMLInputElement).value.trim();

      if (inputValue) {
        // Bubble the structure update payload up to the global/root tree manager
        handleAddNewNode(item.id, inputValue, isShowInput.isFolder as boolean);

        // Collapse and hide the input row following submission
        setIsShowInput({
          ...isShowInput,
          visible: false,
        });
      }
    }
  };

  // --- Render logic for FOLDER node elements ---
  if (item.isFolder) {
    return (
      <section>
        {/* Header containing folder label and target control elements */}
        <div className="folder" onClick={() => setExpanded(!expanded)}>
          <span>📂 {item.name}</span>
          <div>
            <button onClick={(e) => handleNewFolder(e, true)}>Folder</button>
            <button onClick={(e) => handleNewFolder(e, false)}>File</button>
          </div>
        </div>

        {/* Collapsible area containing the inline form and deeply nested child elements */}
        <div
          style={{ paddingLeft: "20px", display: expanded ? "block" : "none" }}
        >
          {/* Node Creation Input Row */}
          {isShowInput.visible && (
            <div className="input_container">
              <span>{isShowInput.isFolder ? "📂" : "📄"}:</span>
              <input
                type="text"
                onKeyDown={handleAddNewFolder}
                onBlur={() =>
                  setIsShowInput({
                    ...isShowInput,
                    visible: false,
                  })
                }
                className="input_container__input"
                placeholder={isShowInput.isFolder ? "Folder name" : "File name"}
                autoFocus // Focus automatically to catch user key strikes immediately
              />
            </div>
          )}

          {/* Recursive Rendering of subfolders or files */}
          {item.items &&
            item.items.map((childItem) => {
              return (
                <Folder
                  key={childItem.id}
                  item={childItem}
                  handleAddNewNode={handleAddNewNode} // Pass the handler drill-down down to all child levels
                />
              );
            })}
        </div>
      </section>
    );
  } else {
    // --- Render layout for standard FILE node leaf units ---
    return <span className="file">📄 {item.name}</span>;
  }
};

export default Folder;
