import React from "react";

/**
 * GreatFrontend Contact Form API Endpoint URL.
 */
const SUBMIT_URL =
  "https://questions.greatfrontend.com/api/questions/contact-form";

/**
 * An uncontrolled Contact Form component built in React and TypeScript.
 *
 * Key Characteristics:
 * - Form values are managed directly by the DOM rather than React state.
 * - Form data is read on demand during submission using the native `FormData` API.
 * - Avoids re-rendering the component on every keypress, making it lightweight.
 */
const UnControlledContactForm: React.FC = () => {
  // Submission indicator state
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  // Stores a snapshot of the submitted data to render UI confirmation after the native form is reset
  const [lastSubmittedData, setLastSubmittedData] = React.useState<Record<
    string,
    string
  > | null>(null);

  /**
   * Handles form submission asynchronously without trigger-based input state tracking.
   * Extracts values straight from the DOM element target.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Access the HTML form element bound to this event
    const form = e.currentTarget;

    try {
      // Validate DOM configuration against target expectations
      if (form.action !== SUBMIT_URL) {
        alert("Incorrect form action value");
        return;
      }

      if (form.method.toLowerCase() !== "post") {
        alert("Incorrect form method value");
        return;
      }

      // Read form input values directly from DOM elements
      const formData = new FormData(form);
      const payload = {
        name: (formData.get("name") as string) || "",
        email: (formData.get("email") as string) || "",
        message: (formData.get("message") as string) || "",
      };

      // Dispatch payload to API server
      const response = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      alert(text);

      // Save payload for local rendering before clearing native DOM fields
      setLastSubmittedData(payload);
      setSubmitted(true);

      // Reset DOM input elements back to initial empty state
      form.reset();
    } catch {
      alert(
        "An error occurred while submitting the form. Please try again later.",
      );
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>Uncontrolled Contact Form</h1>

      {/* Standard HTML Form with native DOM attributes */}
      <form
        action={SUBMIT_URL}
        method="POST"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Name Field */}
        <label htmlFor="name" style={{ display: "block", marginBottom: 10 }}>
          Name:
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            required
            defaultValue=""
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
        <label htmlFor="email" style={{ display: "block", marginBottom: 10 }}>
          Email:
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your email"
            required
            defaultValue=""
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
        <label htmlFor="message" style={{ display: "block", marginBottom: 10 }}>
          Message:
          <textarea
            id="message"
            name="message"
            placeholder="Your Message"
            required
            defaultValue=""
            rows={6}
            style={{
              width: "100%",
              padding: 10,
              marginTop: 6,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </label>

        {/* Submit Button */}
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

      {/* Submission Feedback Display */}
      {submitted && lastSubmittedData && (
        <div style={{ marginTop: 20, color: "#007700" }}>
          Thank you! Your message has been sent. Your Information{" "}
          <pre>{JSON.stringify(lastSubmittedData, null, 2)}</pre> has been
          submitted successfully.
        </div>
      )}
    </div>
  );
};

export default UnControlledContactForm;
