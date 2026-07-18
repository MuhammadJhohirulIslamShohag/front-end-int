import { useEffect, useState } from "react";
import Pagination from "../../components/Shared/Pagination/Pagination";
import type { Product } from "../../types/Products.type";

const Products = () => {
  // ----------------------------------------------------
  // State Management
  // ----------------------------------------------------
  const [dynamicProducts, setDynamicProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // ----------------------------------------------------
  // Side Effects (Data Fetching)
  // ----------------------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Trigger loading overlay before fetch starts

        // DummyJSON uses 'limit' for item count per page and 'skip' for offset calculation
        const itemsPerPage = 5;
        const skipOffset = (page - 1) * itemsPerPage;

        const response = await fetch(
          `https://dummyjson.com/products?limit=${itemsPerPage}&skip=${skipOffset}`,
        );
        const data = await response.json();

        if (data && data.products) {
          setDynamicProducts(data.products);
          setTotal(data.total);
          setTotalPages(Math.ceil(data.total / itemsPerPage));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Disable loading state regardless of success or failure
      }
    };

    fetchProducts();
  }, [page]); // Re-run whenever the user changes the page number

  // ----------------------------------------------------
  // Event Handlers
  // ----------------------------------------------------
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // ----------------------------------------------------
  // Render JSX
  // ----------------------------------------------------
  return (
    <div className="products_page_container">
      <h1>Products</h1>
      <p>
        Total Products: {total} / Page Number: {page}/{totalPages}
      </p>

      {/* Relative wrapper allows absolute centering of the loading screen */}
      <div className="grid_wrapper_relative">
        {/* Conditional Loader Overlay */}
        {loading && (
          <div className="loader_overlay">
            <div className="spinner"></div>
          </div>
        )}

        {/* Product Layout Grid - Dims content slightly if background loading is active */}
        <div className={`product_card ${loading ? "content_loading" : ""}`}>
          {dynamicProducts.map((product) => (
            <div key={product.id} className="product_single_card">
              <div className="product_image_container">
                <img src={product.thumbnail} alt={product.title} />
              </div>

              <h2>{product.title}</h2>

              {/* Truncate descriptions longer than 20 characters to keep cards visually clean */}
              <p>
                {product.description.length > 20
                  ? product.description.slice(0, 50) + "....."
                  : "No description available."}
              </p>

              <p className="price">Price: ${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Control Footer */}
      <div className="pagination">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Products;
