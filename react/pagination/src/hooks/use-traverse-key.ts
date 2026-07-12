import type { ExplorerItem } from "../types/ExplorerItem.type";

/**
 * A custom hook providing utility functions to traverse and manipulate
 * a hierarchical file/folder tree structure.
 */
export const useTraverseKey = () => {
  /**
   * Recursively searches a file explorer tree to find a specific folder by ID,
   * and inserts a new child node (file or folder) at the top of its items list.
   * * @param tree - The current root or sub-node of the explorer tree being scanned.
   * @param folderId - The unique ID of the target folder where the item should be added.
   * @param item - The name of the new file or folder being created.
   * @param isFolder - Flag specifying whether the new node is a folder (true) or a file (false).
   * @returns {boolean} Returns true if the node was successfully inserted, false otherwise.
   */
  function insertNode(
    tree: ExplorerItem,
    folderId: string,
    item: string,
    isFolder: boolean,
  ): boolean {
    // BASE CASE 1: Check if the current node is the target folder
    if (tree.id === folderId && tree.isFolder) {
      // Structure the new file or folder object
      const newItem: ExplorerItem = {
        id: Date.now().toString(), // Generates a simple, unique string timestamp ID
        name: item,
        isFolder: isFolder,
        // Folders initialize with an empty array for future nesting;
        // Files default to an empty array (or null/undefined depending on your type definitions)
        items: isFolder ? [] : [],
      };

      // If the target folder safely exposes an items array, prepend the new node
      if (tree.items) {
        tree.items.unshift(newItem); // unshift places the new file/folder at the very top of the list
        return true; // Stop searching and signal successful insertion
      }
    }

    // RECURSIVE STEP: If the current node isn't the target, dig deeper into its children
    if (tree.items) {
      for (const child of tree.items) {
        // Recursively invoke insertNode on each child element
        const didInsert = insertNode(child, folderId, item, isFolder);

        // If a deeply nested call returns true, bubble that success up immediately
        // to break out of remaining sibling loops
        if (didInsert) return true;
      }
    }

    // BASE CASE 2: The target folder ID was not found anywhere within this branch
    return false;
  }

  return { insertNode };
};
