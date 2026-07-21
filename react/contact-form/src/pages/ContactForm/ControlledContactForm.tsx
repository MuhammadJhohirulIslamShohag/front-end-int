import React from "react";
import { type FormData } from "../../types/contact.type";

/**
 * Endpoint URL required by GreatFrontend for contact form submissions.
 */
const SUBMIT_URL =
  "https://questions.greatfrontend.com/api/questions/contact-form";

/**
 * A fully controlled Contact Form component in React and TypeScript.
 * Manages form state internally and handles asynchronous submission via the Fetch API.
 */
const ControlledContactForm: React.FC = () => {
  // Submission success indicator state
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  // Centralized form field values state
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  /**
   * Universal change handler for text inputs and textareas.
   * Dynamically updates `formData` based on the element's `name` attribute.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  /**
   * Handles form submission, performs DOM validation checks, and sends data to the API endpoint.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Target the underlying DOM element for validation
    const form = e.currentTarget;

    try {
      // Validate HTML action attribute against the target URL
      if (form.action !== SUBMIT_URL) {
        alert("Incorrect form action value");
        return;
      }

      // Validate HTTP method matches submission method
      if (form.method.toLowerCase() !== "post") {
        alert("Incorrect form method value");
        return;
      }

      // Read form data from state for JSON transmission
      const response = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      alert(text);

      // Flag successful submission and reset form state back to initial values
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch {
      alert("Error submitting form!");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>Contact Us</h1>

      {/* Form Element: Includes fallback HTML attributes for native compatibility */}
      <form
        onSubmit={handleSubmit}
        noValidate
        method="POST"
        action={SUBMIT_URL}
      >
        {/* Name Field */}
        <label htmlFor="name" style={{ display: "block", marginBottom: 12 }}>
          Name
          <input
            id="name"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: 10,
              marginTop: 6,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </label>

        {/* Email Field */}
        <label htmlFor="email" style={{ display: "block", marginBottom: 12 }}>
          Email
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: 10,
              marginTop: 6,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </label>

        {/* Message Field */}
        <label htmlFor="message" style={{ display: "block", marginBottom: 12 }}>
          Message
          <textarea
            id="message"
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            style={{
              width: "100%",
              padding: 10,
              marginTop: 6,
              borderRadius: 4,
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          />
        </label>

        {/* Submit Action */}
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            borderRadius: 4,
            border: "none",
            backgroundColor: "#0070f3",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Send Message
        </button>
      </form>

      {/* Success Notification Banner */}
      {submitted && (
        <div style={{ marginTop: 20, color: "#007700" }}>
          Thank you! Your message has been submitted successfully.
        </div>
      )}
    </div>
  );
};

export default ControlledContactForm;
