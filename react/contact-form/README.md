# React Forms: Controlled vs. Uncontrolled Components

A reference guide and interview breakdown for explaining Controlled and Uncontrolled form implementations in React and TypeScript.

---

## 🎙️ Interview Talking Points

### 1. Core Architectural Difference
> *"In a **Controlled component**, React acts as the 'single source of truth' by synchronizing every character typed into state via `useState`. In an **Uncontrolled component**, the DOM itself retains the source of truth, and we pull the current values on-demand—typically during form submission—using the native `FormData` API or `useRef`."*

---

### 2. Performance & Re-renders
> *"Uncontrolled forms don't trigger a re-render on every keystroke. For large forms with dozens of fields or embedded heavy components, uncontrolled inputs prevent needless render cycles and keep input latency minimal."*

---

### 3. When to Choose Which?

#### Choose **Controlled** when:
* You need **instant field-level validation** on keypress (e.g., password strength meters, real-time character counters).
* Inputs rely on **conditional state logic** (e.g., dynamically disabling the submit button until all required fields are valid).
* Fields **depend on each other's live values** (e.g., matching password and confirm password inputs).

#### Choose **Uncontrolled** when:
* You want **simple, performant forms** with minimal boilerplate code.
* You are integrating with **non-React legacy JavaScript libraries** or third-party DOM plugins.
* Form validation happens **exclusively on submission** or relies on native browser validation (`required`, `type="email"`, pattern matching).

---

### 4. Clean State Cleanup Strategy
> *"In uncontrolled forms, resetting input state is clean and simple: calling `form.reset()` clears all native input DOM elements instantly without manual state resets. To display post-submission feedback, I capture a snapshot of the submitted data in component state prior to triggering `form.reset()`."*

---

## ⚡ Quick Comparison Summary

| Feature | Controlled Component | Uncontrolled Component |
| :--- | :--- | :--- |
| **Source of Truth** | React State (`useState`) | Native HTML DOM |
| **Value Access** | Live / Synchronous | On-demand (`FormData` or `ref`) |
| **Re-renders** | On every keystroke | Only on submit / explicit state changes |
| **Form Reset** | Manual state reset (`setForm({...})`) | Native DOM reset (`form.reset()`) |
| **Ideal Use Case** | Complex UX, dynamic validation | High performance, simple forms, integration |