/**
 * Represents a single image item used across UI components (e.g., Carousels, Galleries).
 */
export interface Image {
  /** The accessible image source URL or local path. */
  src: string;

  /** Descriptive alternative text for screen readers and accessibility (a11y). */
  alt: string;
}
