import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Please log in to view your cart!");
      navigate("/login");
      return;
    }

    try {
      const userObj = JSON.parse(storedUser);
      setUser(userObj);
      
      const userCartKey = `cart_${userObj.id}`;
      const cart = JSON.parse(localStorage.getItem(userCartKey) || "[]");
      setCartItems(cart);
    } catch (e) {
      console.error("Error parsing user data:", e);
      navigate("/login");
      return;
    }
    
    setIsLoading(false);
  }, [navigate]);

  const updateCartItem = (recipeId, newServings) => {
    if (newServings < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.recipeId === recipeId 
        ? { ...item, servings: newServings, price: (item.price / item.servings) * newServings }
        : item
    );
    
    setCartItems(updatedCart);
    
    const userCartKey = `cart_${user.id}`;
    localStorage.setItem(userCartKey, JSON.stringify(updatedCart));
    
    // Update cart count in navbar
    const event = new CustomEvent('cartUpdated', { detail: updatedCart.length });
    window.dispatchEvent(event);
  };

  const removeFromCart = (recipeId) => {
    const updatedCart = cartItems.filter(item => item.recipeId !== recipeId);
    setCartItems(updatedCart);

    const userCartKey = `cart_${user.id}`;
    localStorage.setItem(userCartKey, JSON.stringify(updatedCart));
    
    const event = new CustomEvent('cartUpdated', { detail: updatedCart.length });
    window.dispatchEvent(event);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#509343]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 pt-20">
      <div className="mb-8">
        <Link to="/recipes" className="text-[#034694] hover:text-[#034610] mr-4 font-semibold flex items-center">
          <FaArrowLeft className="inline mr-2" />
          Back to Recipes
        </Link>
        <h1 className="text-3xl font-extrabold text-[#034694] mt-4">Your Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <FaShoppingCart className="text-6xl text-[#034694] mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-[#034694] mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some delicious recipes to get started!</p>
          <Link
            to="/recipes"
            className="bg-[#034694] hover:bg-[#012147] text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
          >
            Browse Recipes
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#034694]/30">
          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="relative flex items-start space-x-4 p-4 border border-[#034694]/20 rounded-xl bg-[#eaf1fa] min-h-[100px]"
              >
                <img
                  src={`/api/${item.image}`}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-lg border border-[#509343]/30 mt-1"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-[#0B5A02]">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-1">Servings: {item.servings}</p>
                  <div className="mb-2">
                    <span className="block text-xs text-[#509343] font-semibold mb-1">Ingredients:</span>
                    <ul className="list-disc list-inside text-xs text-gray-700">
                      {item.ingredients && item.ingredients.map((ingredient, idx) => (
                        <li key={idx}>
                          {ingredient.name}: {ingredient.quantity} {ingredient.unit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="font-semibold text-[#509343] mt-2">
                    Total: ₹{item.price}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setItemToDelete(item.recipeId);
                    setShowDeleteConfirm(true);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 text-2xl"
                  title="Remove from cart"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="border-t pt-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold text-[#012147]">Total:</span>
              <span className="text-2xl font-bold text-[#034694]">₹{calculateTotal()}</span>
            </div>
            <Link
              to="/checkout"
              className="w-full bg-[#034694] hover:bg-[#012147] text-white py-3 px-6 rounded-xl font-bold transition-colors duration-200 flex items-center justify-center space-x-2 shadow-md"
            >
              <FaShoppingCart />
              <span>Proceed to Checkout</span>
            </Link>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-10 w-full max-w-md md:max-w-lg rounded-2xl shadow-2xl flex flex-col">
            <p className="mb-8 text-xl font-semibold text-gray-800">Are you sure you want to remove this recipe?</p>
            <div className="flex justify-end gap-4 mt-2">
              <button
                onClick={() => {
                  removeFromCart(itemToDelete);
                  setShowDeleteConfirm(false);
                  toast.success("Recipe removed from cart");
                }}
                className="bg-[#034694] hover:bg-[#012147] text-white px-6 py-2 rounded-lg font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#034694] focus:ring-offset-2"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-white border border-[#034694] hover:bg-gray-100 text-[#034694] px-6 py-2 rounded-lg font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#034694] focus:ring-offset-2"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;