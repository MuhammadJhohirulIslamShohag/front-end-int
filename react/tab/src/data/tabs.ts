import type { Tab } from "../types/Tabs.type";

/**
 * Default set of tabs used as fallback data for the Tabs component.
 * Provides initial content covering core web development technologies.
 */
export const INITIAL_TABS: Tab[] = [
  {
    id: 1,
    name: "HTML",
    text: "The HyperText Markup Language or HTML is the standard markup language for documents designed to be displayed in a web browser.",
  },
  {
    id: 2,
    name: "CSS",
    text: "Cascading Style Sheets is a style sheet language used for describing the presentation of a document written in a markup language such as HTML or XML.",
  },
  {
    id: 3,
    name: "JavaScript",
    text: "JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS.",
  },
];
