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
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:3000/api/auth/login",
        { email, password }
      );

      const { token, name, role, _id } = response.data;

      localStorage.setItem("user", JSON.stringify({ token, name, role, email:response?.data?.email ?? email, _id}));
      localStorage.setItem("userId", _id); 

      console.log("Stored user:", localStorage.getItem("user"));
      console.log("Stored userId:", localStorage.getItem("userId"));

      toast.success(`Welcome back, ${name}!`);

      if (`${role}="user"`) {
          navigate("/");
        } else {
          navigate("/admindash");
        }
    } catch (error) {
      const tooManyAttemptsMsg = "Too many login attempts. Please try again later.";
      if (
        error.response?.status === 429 &&
        (error.response?.data?.error === tooManyAttemptsMsg ||
         error.response?.data?.message === tooManyAttemptsMsg)
      ) {
        toast.error(tooManyAttemptsMsg);
      } else {
        const errorMsg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed. Please try again.";
        toast.error(errorMsg);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#034694]/10 via-white to-[#034694]/5 relative">
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center px-4 py-8 w-full gap-x-12">
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="block w-full px-4 py-3 bg-[#034694]/5 border border-[#034694]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034694] focus:border-[#034694] transition text-black pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0 m-0 bg-transparent border-none outline-none flex items-center justify-center"
                  style={{ width: '24px', height: '24px' }}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="22" height="22">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="22" height="22">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a9.956 9.956 0 012.293-3.95M6.873 6.872A9.956 9.956 0 0112 5c4.478 0 8.269 2.943 9.543 7a9.956 9.956 0 01-4.293 5.95M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                    </svg>
                  )}
                </button>
              </div>
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
