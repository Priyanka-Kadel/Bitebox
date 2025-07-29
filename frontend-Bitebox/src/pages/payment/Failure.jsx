import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import eSewaIcon from "../../assets/icons/esewa.jpg";

const Failure = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [orderId, setOrderId] = useState(null);
  
    useEffect(() => {

      const urlParams = new URLSearchParams(location.search);
      const orderIdFromUrl = urlParams.get('orderId');
      setOrderId(orderIdFromUrl);
      
      toast.error("Payment Failed!", { autoClose: 3000 });
      const timer = setTimeout(() => {
        navigate("/");
      }, 5000);
  
      return () => clearTimeout(timer);
    }, [navigate, location.search]);
  
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        {/* eSewa Header with Icon */}
        <div className="flex items-center justify-center mb-8">
          <img src={eSewaIcon} alt="eSewa Icon" className="w-10 h-10 mr-2" />
          <div className="text-white text-3xl font-bold">eSewa</div>
        </div>
  
        {/* Payment Success Frame */}
        <div className="text-center bg-gray-800 p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-3xl font-bold text-red-400">Payment Failed! Please Try Again.</h2>
          {orderId && (
            <p className="text-gray-300 mt-2 text-sm">
              Order ID: {orderId}
            </p>
          )}
          <p className="text-gray-300 mt-2">
            <img
              src="../../src/assets/images/error.gif"
              alt="Error"
              className="w-96 h-64 object-cover rounded-lg shadow-md"
            />
          </p>
          <p className="text-red-400 mt-4 text-lg font-bold">
            Redirecting back to HomeScreen...
          </p>
        </div>
      </div>
    );
  };

export default Failure;
