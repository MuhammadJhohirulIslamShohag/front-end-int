import "./App.css";
import Products from "./pages/Products/Products";
import { useCallback, useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("https://dummyjson.com/products");
      const data = await response.json();

      if (data && data.products) {
        setProducts(data.products);
        setTotal(data.total / 10);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  console.log("products", products, "total", total);

  return (
    <div className="App">
      <Products products={products} total={total} />
    </div>
  );
}

export default App;
