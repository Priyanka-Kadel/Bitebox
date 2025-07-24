import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import tickGif from "../../assets/images/tick.gif";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [deliveryDate, setDeliveryDate] = useState("");

  // Get order details from navigation state
  const order = location.state?.orderDetails;

  useEffect(() => {
    // Calculate delivery date (next day)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeliveryDate(tomorrow.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }));

    // Redirect to home after 10 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  if (!order) {
    // Fallback if accessed directly
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