import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import registerIllustration from '../../assets/images/login.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const validateForm = () => {
    // Check if all fields are filled
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("All fields are required");
      return false;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (validateForm()) {
      try {
     
        const response = await axios.post(
          "http://localhost:3000/api/auth/register",
          formData
        );

        if (response.data.success) {
          toast.success("User registered successfully!"); // Show success toast
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          navigate("/login"); // Redirect to login page after successful signup
        }
      } catch (error) {
        const errorMsg =
          error.response?.data?.message || "Something went wrong!";
        toast.error(errorMsg); // Show error toast (e.g., email already exists)
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#034694]/10 via-white to-[#034694]/5 relative">
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center px-4 py-8 w-full gap-x-12">
        {/* Right: Register Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-10 bg-white/95 rounded-3xl shadow-2xl border border-[#034694]/20 max-w-md md:mr-8">
          <h2 className="text-3xl font-extrabold text-center text-black mb-8 tracking-tight">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label htmlFor="name" className="block text-base font-semibold text-black mb-1">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-4 py-2 bg-[#034694]/5 border border-[#034694]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034694] focus:border-[#034694] transition text-black"
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-base font-semibold text-black mb-1">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-4 py-2 bg-[#034694]/5 border border-[#034694]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034694] focus:border-[#034694] transition text-black"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-base font-semibold text-black mb-1">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-4 py-2 bg-[#034694]/5 border border-[#034694]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034694] focus:border-[#034694] transition text-black"
                autoComplete="new-password"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-base font-semibold text-black mb-1">Re-type Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Re-type password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full px-4 py-2 bg-[#034694]/5 border border-[#034694]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034694] focus:border-[#034694] transition text-black"
                autoComplete="new-password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#034694] hover:bg-[#034694]/80 text-white font-bold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-[#034694] transition text-lg"
            >
              Register
            </button>
          </form>
          <div className="flex flex-col gap-2 mt-6">
            <p className="text-center text-sm text-black">
              Already have a Bitebox account?{' '}
              <a href="/login" className="text-[#034694] hover:underline font-medium">Login</a>
            </p>
          </div>
        </div>
        {/* Left: Illustration */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center h-full md:ml-8">
          <img
            src={registerIllustration}
            alt="Bitebox Register Illustration"
            className="h-full max-h-[600px] w-auto object-contain drop-shadow-2xl"
            style={{ minHeight: '400px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
