import { useTraverseKey } from "./hooks/use-traverse-key.ts";
import { useState } from "react";
import explorer from "./data/folderData.ts";
import Folder from "./components/Folder.js";
import "./App.css";

/**
 * The root Application component.
 * Manages the global state of the file explorer tree structure and provides
 * structure mutation methods downstream to nested interactive components.
 */
function App() {
  // Main state holding the complete hierarchical file/folder tree object
  const [explorerData, setExplorerData] = useState(explorer);

  // Debug log to monitor live modifications to the tree structure in the console
  console.log(explorerData);

  // Extract the custom tree-mutation logic hook
  const { insertNode } = useTraverseKey();

  /**
   * Action handler passed deep down into the Folder component layers.
   * Clones the current tree state, invokes the deep mutation hook, and updates the local state.
   * * @param folderId - The unique target directory identifier receiving the new element.
   * @param itemName - The string text literal specifying the new element's identity title.
   * @param isFolder - Flag toggling between file layout properties or sub-item directories.
   */
  const handleAddNewNode = (
    folderId: string,
    itemName: string,
    isFolder: boolean,
  ) => {
    // 1. Create a shallow clone of the root state to adhere to React state immutability patterns
    const newExplorerData = { ...explorerData };

    // 2. Execute the deep recursive scan and mutation on the cloned object reference
    const didInsert = insertNode(newExplorerData, folderId, itemName, isFolder);

    // 3. Only trigger an expensive UI re-render cycle if an actual data insert occurred
    if (didInsert) {
      setExplorerData(newExplorerData);
    } else {
      console.error("Failed to insert the new item.");
    }
  };

  return (
    <>
      <section>
        {/* Render the entry-point node wrapper and delegate tree synchronization controls downward */}
        <Folder item={explorerData} handleAddNewNode={handleAddNewNode} />
      </section>
    </>
  );
}

export default App;
