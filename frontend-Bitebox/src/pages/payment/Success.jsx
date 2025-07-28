import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import tickGif from "../../assets/images/tick.gif";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [deliveryDate, setDeliveryDate] = useState("");
  const [order, setOrder] = useState(location.state?.orderDetails);
  const [loading, setLoading] = useState(false);

  // Get orderId from URL params (for eSewa redirects)
  const urlParams = new URLSearchParams(location.search);
  const orderIdFromUrl = urlParams.get('orderId');

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeliveryDate(tomorrow.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }));


    if (orderIdFromUrl && !order) {
      setLoading(true);
      fetchOrderDetails(orderIdFromUrl);
    }

    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate, orderIdFromUrl, order]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`https://localhost:3000/api/orders/${orderId}/status`);
      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#034694] mb-6"></div>
        <p className="text-gray-700">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <img src={tickGif} alt="Success" className="w-32 h-32 mb-6" />
        <h2 className="text-3xl font-bold mb-2" style={{ color: '#034694' }}>Order Placed Successfully!</h2>
        <p className="text-gray-700 mb-6">Thank you for your order.</p>
        <Link to="/" className="bg-[#034694] hover:bg-[#034694] text-white px-6 py-2 rounded-lg font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#034694] focus:ring-offset-2">
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <img src={tickGif} alt="Success" className="w-32 h-32 mb-6" />
      <h2 className="text-3xl font-bold mb-2" style={{ color: '#034694' }}>Order Placed Successfully!</h2>
      <p className="text-gray-700 mb-4">Thank you for your order. Your delicious ingredients are on the way!</p>
              <div className="border rounded-xl p-6 w-full max-w-lg mb-6" style={{ backgroundColor: '#03469410', borderColor: '#03469430' }}>
          <h3 className="text-xl font-semibold text-[#509343] mb-4">Order Details</h3>
        <div className="mb-2">
          <span className="font-medium text-gray-700">Order ID:</span> <span className="text-gray-900">{order.id}</span>
        </div>
        <div className="mb-2">
          <span className="font-medium text-gray-700">Delivery Address:</span> <span className="text-gray-900">{order.customerInfo.address}, {order.customerInfo.city}</span>
        </div>
        <div className="mb-2">
          <span className="font-medium text-gray-700">Contact:</span> <span className="text-gray-900">{order.customerInfo.firstName} {order.customerInfo.lastName} ({order.customerInfo.phone})</span>
        </div>
        <div className="mb-2">
          <span className="font-medium text-gray-700">Payment Method:</span> <span className="text-gray-900">{order.paymentMethod === "cod" ? "Cash on Delivery" : "eSewa"}</span>
        </div>
        <div className="mb-2">
          <span className="font-medium text-gray-700">Total:</span> <span className="text-gray-900">₹{order.total}</span>
        </div>
        <div className="mb-2">
          <span className="font-medium text-gray-700">Recipes:</span>
          <ul className="list-disc list-inside text-gray-900">
            {order.items.map(item => (
              <li key={item.recipeId}>
                {item.title} ({item.servings} servings)
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <span className="font-medium text-gray-700">Estimated Delivery Date:</span>
          <span className="text-gray-900 ml-2">{deliveryDate}</span>
        </div>
      </div>
      <p className="text-gray-500 mb-8">You will be redirected to the home page shortly.</p>
              <Link to="/" className="bg-[#034694] hover:bg-[#034694] text-white px-6 py-2 rounded-lg font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#034694] focus:ring-offset-2">
        Go to Home
      </Link>
    </div>
  );
};

export default Success;