import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCreditCard, FaLock, FaUser } from "react-icons/fa";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: ""
  });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState(null);

  const esewaCall = (formData) => {
    console.log("Form data to eSewa:", formData); 
    const path = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
    const form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", path);

    for (var key in formData) {
      const hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", formData[key]);
      form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form.submit();
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      alert("Please log in to checkout!");
      navigate("/login");
      return;
    }

    try {
      const userObj = JSON.parse(storedUser);
      setUser(userObj);
      
      const userCartKey = `cart_${userObj.id}`;
      const cart = JSON.parse(sessionStorage.getItem(userCartKey) || "[]");
      setCartItems(cart);
      
      if (cart.length === 0) {
        alert("Your cart is empty!");
        navigate("/recipes");
        return;
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
      navigate("/login");
      return;
    }
    
    setIsLoading(false);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const getTotalServings = () => {
    return cartItems.reduce((total, item) => total + item.servings, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      const order = {
        id: Date.now().toString(),
        items: cartItems,
        customerInfo: formData,
        paymentMethod,
        total: getTotalPrice(),
        status: "pending",
        createdAt: new Date().toISOString()
      };

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orders = JSON.parse(sessionStorage.getItem("orders") || "[]");
      orders.push(order);
      sessionStorage.setItem("orders", JSON.stringify(orders));

      const userCartKey = `cart_${user._id}`;
      localStorage.removeItem(userCartKey);

      const event = new CustomEvent('cartUpdated', { detail: 0 });
      window.dispatchEvent(event);


      navigate("/success", { 
        state: { 
          orderId: order.id,
          orderDetails: order 
        } 
      });

    } catch (error) {
      console.error("Error processing order:", error);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEsewaPayment = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      const order = {
        id: Date.now().toString(),
        items: cartItems,
        customerInfo: formData,
        paymentMethod: "esewa",
        total: getTotalPrice(),
        status: "paid",
        createdAt: new Date().toISOString()
      };

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orders = JSON.parse(sessionStorage.getItem("orders") || "[]");
      orders.push(order);
      sessionStorage.setItem("orders", JSON.stringify(orders));

      const userCartKey = `cart_${user._id}`;
      localStorage.removeItem(userCartKey);

      const event = new CustomEvent('cartUpdated', { detail: 0 });
      window.dispatchEvent(event);

      navigate("/success", { 
        state: { 
          orderId: order.id,
          orderDetails: order 
        } 
      });

    } catch (error) {
      console.error("Error processing eSewa payment:", error);
      alert("There was an error processing your eSewa payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#034694]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pt-20">
      <div className="flex-grow px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <Link 
                to="/cart" 
                className="flex items-center text-[#034694] hover:text-[#012147] transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Cart
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaUser className="mr-2 text-[#034694]" />
                  Customer Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#034694] focus:border-transparent ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#034694] focus:border-transparent ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#034694] focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#034694] focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter 10-digit phone number"
                      maxLength="10"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-[#034694]" />
                  Delivery Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#034694] focus:border-transparent ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your delivery address"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#034694] focus:border-transparent ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your city"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaCreditCard className="mr-2 text-[#034694]" />
                  Payment Method
                </h2>
                
                <div className="space-y-4">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 text-[#034694] focus:ring-[#034694]"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Cash on Delivery</div>
                      <div className="text-sm text-gray-500">Pay when you receive your order</div>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="esewa"
                      checked={paymentMethod === "esewa"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 text-[#034694] focus:ring-[#034694]"
                    />
                    <div>
                      <div className="font-medium text-gray-900">eSewa</div>
                      <div className="text-sm text-gray-500">Pay securely with eSewa</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.recipeId} className="flex items-center space-x-3">
                      <img
                        src={`/api/${item.image}`}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.servings} servings</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">₹{item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="text-[#034694]">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Place Order Button */}
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={isProcessing || paymentMethod !== "cod"}
                    className={`w-full bg-[#034694] hover:bg-[#012147] disabled:bg-gray-400 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center ${paymentMethod !== "cod" ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    {isProcessing && paymentMethod === "cod" ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaLock className="mr-2" />
                        Place Order - ₹{getTotalPrice()}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing || paymentMethod !== "esewa"}
                    className={`w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center ${paymentMethod !== "esewa" ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleEsewaPayment}
                  >
                    {isProcessing && paymentMethod === "esewa" ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Redirecting to eSewa...
                      </>
                    ) : (
                      <>
                        <FaLock className="mr-2" />
                        Pay with eSewa - ₹{getTotalPrice()}
                      </>
                    )}
                  </button>
                </div>
                
                {/* Security Notice */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Your payment information is secure and encrypted
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
