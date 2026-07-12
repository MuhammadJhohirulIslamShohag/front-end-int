/**
 * Represents a single node within a hierarchical file system explorer tree.
 * A node can act either as a structural container (Folder) or a leaf unit (File).
 */
export interface ExplorerItem {
  /** Unique identifier for the item (e.g., a UUID or string timestamp) */
  id: string;

  /** The display name of the file or folder (e.g., "src" or "index.tsx") */
  name: string;

  /** * Flag to differentiate node types:
   * true  -> The item is a folder and can contain sub-items.
   * false -> The item is a file and acts as an end leaf.
   */
  isFolder: boolean;

  /** * An array containing child nodes nested within this folder.
   * If the item is a file, this array will typically remain empty or unused.
   */
  items: ExplorerItem[];
}
