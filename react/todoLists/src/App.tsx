import "./App.css";
import TodoLists from "./pages/TodoLists/TodoLists";

function App() {
  return (
    // Main application wrapper container
    <div className="App">
      <header>Header</header>
      <div className="content">
        <nav>Navigation</nav>
        <main>
          <TodoLists />
        </main>
        <aside>Sidebar</aside>
      </div>
      <footer>Footer</footer>
    </div>
  );
}

export default App;
