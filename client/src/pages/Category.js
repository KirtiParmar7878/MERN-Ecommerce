import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real app, fetch categories from backend
    // For now, using hardcoded categories
    setCategories(['Electronics', 'Fashion', 'Books', 'Home & Kitchen']);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchProductsByCategory = async (category) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/products/category/${category}`);
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products);
        setError(null);
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

  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="mb-4">Categories</h2>
        
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedCategory && (
          <div>
            <h3>Products in {selectedCategory}</h3>
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : error ? (
              <div className="text-danger">{error}</div>
            ) : products.length === 0 ? (
              <p>No products found in this category.</p>
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
        )}
      </div>
    </Layout>
  );
};

export default Category;
