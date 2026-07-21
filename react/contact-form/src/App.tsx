import "./App.css";
import ControlledContactForm from "./pages/ContactForm/ControlledContactForm";
import UnControlledContactForm from "./pages/ContactForm/UnControlledContactForm";

function App() {
  return (
    // Main application wrapper container
    <div className="App">
      <ControlledContactForm />
      <UnControlledContactForm />
    </div>
  );
}

export default App;
