import "./App.css";
import Products from "./pages/Products/Products";

function App() {
  return (
    // Main application wrapper container
    <div className="App">
      {/* Primary views/pages go here. Currently rendering the paginated products grid. */}
      <Products />
    </div>
  );
}

export default App;
