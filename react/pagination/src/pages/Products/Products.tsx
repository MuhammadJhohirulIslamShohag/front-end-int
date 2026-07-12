import Pagination from "../../components/Shared/Pagination/Pagination";
import type { Product } from "../../types/Products.type";

interface ProductsProps {
  products: Product[];
  total: number;
}

const Products = ({ products, total }: ProductsProps) => {
  console.log("products", products, "total", total);

  return (
    <div>
      <h1>Products</h1>
      <p>Total Products: {total}</p>
      <div className="product_card">
        {products.map((product) => (
          <div key={product.id} className="product_single_card">
            <span>
              <img src={product.thumbnail} alt={product.title} />
            </span>
            <h2>{product.title}</h2>
            <p>
              {product.description.length > 20
                ? product.description.slice(0, 50) + "....."
                : "No description available."}
            </p>
            <p>Price: ${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        <Pagination />
      </div>
    </div>
  );
};

export default Products;
