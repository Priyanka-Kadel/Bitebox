import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Footer from "../../components/Footer"; 
import Navbar from "../../components/Navbar";
import loginIllustration from '../../assets/images/login.png';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password }
      );

      const { token, name, role, _id } = response.data;

      // Store user details and userId in localStorage
      localStorage.setItem("user", JSON.stringify({ token, name, role, email:response?.data?.email ?? email, _id}));
      localStorage.setItem("userId", _id); // Store the userId
     
      // Log the stored values for debugging
      console.log("Stored user:", localStorage.getItem("user"));
      console.log("Stored userId:", localStorage.getItem("userId"));

      // Display the success toast message
      toast.success(`Welcome back, ${name}!`);

      // Redirect to home page
      // navigate("/");
      if (`${role}="user"`) {
          navigate("/");
        } else {
          navigate("/admindash");
        }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Login failed. Please try again.";

      toast.error(errorMsg); // Display error toast if login fails
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#034694]/10 via-white to-[#034694]/5 relative">
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center px-4 py-8 w-full gap-x-12">
        {/* Right: Login Form (now first in DOM, so left on md+) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 bg-white/95 rounded-3xl shadow-2xl border border-[#034694]/20 max-w-md md:mr-8">
          <h2 className="text-4xl font-extrabold text-center text-black mb-6 tracking-tight">Sign in</h2>
          <p className="text-center text-black mb-8 text-base">Welcome back to <span className="font-bold">Bitebox</span>! Please enter your details to access your favorite recipes.</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-base font-semibold text-black mb-1">Email</label>
              <input
                type="email"
                id="email"
                className="block w-full px-4 py-3 bg-[#034694]/5 border border-[#034694]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034694] focus:border-[#034694] transition text-black"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-base font-semibold text-black mb-1">Password</label>
              <input
                type="password"
                id="password"
                className="block w-full px-4 py-3 bg-[#034694]/5 border border-[#034694]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034694] focus:border-[#034694] transition text-black"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#034694] hover:bg-[#034694]/80 text-white font-bold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-[#034694] transition text-lg"
            >
              Sign In
            </button>
          </form>
          <div className="flex flex-col gap-2 mt-8">
            <p className="text-center text-sm text-black">
              Forgot your password?{' '}
              <a href="/forgot-password" className="text-[#034694] hover:underline font-medium">Reset here</a>
            </p>
            <p className="text-center text-sm text-black">
              Don’t have a Bitebox account?{' '}
              <a href="/register" className="text-[#034694] hover:underline font-medium">Register</a>
            </p>
          </div>
        </div>
        {/* Left: Illustration (now second in DOM, so right on md+) */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center h-full md:ml-8">
          <img
            src={loginIllustration}
            alt="Bitebox Login Illustration"
            className="h-full max-h-[600px] w-auto object-contain drop-shadow-2xl"
            style={{ minHeight: '400px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
