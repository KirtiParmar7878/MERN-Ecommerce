import React, { useEffect, useState } from "react";
import Layout from "./../components/Layout/Layout";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/v1/products");
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products);
      } else {
        setError(data.message || "Failed to fetch products");
      }
    } catch (err) {
      setError("Network error while fetching products");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await fetch("/api/v1/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token },
          body: JSON.stringify({ 
            productId: product._id, 
            name: product.name, 
            price: product.price, 
            quantity: 1 
          }),
        });
        const data = await res.json();
        if (res.ok) {
          alert("Added to cart (server)");
          localStorage.setItem("cart", JSON.stringify(data.cart.items || []));
        } else {
          alert(data.message || "Failed to add to cart");
        }
      } catch (err) {
        alert("Network error while adding to cart");
      }
    } else {
      const existing = JSON.parse(localStorage.getItem("cart") || "[]");
      existing.push({ ...product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(existing));
      alert("Added to local cart (not logged in)");
    }
    window.location.reload();
  };

  if (loading) return <Layout><div className="text-center mt-5">Loading...</div></Layout>;
  if (error) return <Layout><div className="text-center mt-5 text-danger">{error}</div></Layout>;

  return (
    <Layout>
      <div className="container mt-4">
        <h1 className="mb-4">Our Products</h1>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {products.map((product) => (
              <div key={product._id} className="col">
                <div className="card h-100">
                  <img 
                    src={product.image || "/images/default.png"} 
                    className="card-img-top" 
                    alt={product.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-truncate">{product.description}</p>
                    <p className="card-text">Category: {product.category}</p>
                    <p className="card-text">Price: ₹{product.price}</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => addToCart(product)}
                      disabled={product.stock < 1}
                    >
                      {product.stock < 1 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
