/**
 * Represents an individual tab item within a tabbed interface component.
 */
export interface Tab {
  /**
   * Unique identifier for the tab. Used for state tracking and DOM element referencing.
   */
  id: number;

  /**
   * The text label displayed inside the tab button.
   */
  name: string;

  /**
   * The body content displayed inside the associated tab panel when active.
   */
  text: string;
}
