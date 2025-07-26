import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import registerIllustration from '../../assets/images/login.png';

const EmailVerification = () => {
  const [verificationToken, setVerificationToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Get user data from location state (passed from Register component)
  const userData = location.state?.userData;

  useEffect(() => {
    // If no user data, redirect to register
    if (!userData) {
      toast.error("Please complete registration first");
      navigate("/register");
      return;
    }

    // Start countdown for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [userData, navigate, countdown]);

  const handleVerification = async (e) => {
    e.preventDefault();
    
    if (!verificationToken.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://localhost:3000/api/auth/verify-email",
        {
          email: userData.email,
          verificationToken: verificationToken.trim()
        }
      );

      if (response.data.success) {
        toast.success("Email verified successfully! You can now login.");
        navigate("/login");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Verification failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendToken = async () => {
    setResendLoading(true);
    try {
      const response = await axios.post(
        "https://localhost:3000/api/auth/resend-verification",
        {
          email: userData.email
        }
      );

      if (response.data.success) {
        toast.success("Verification code resent to your email!");
        setCountdown(60); // 60 seconds countdown
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to resend verification code.";
      toast.error(errorMsg);
    } finally {
      setResendLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) { // Limit to 6 digits
      setVerificationToken(value);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#034694]/10 via-white to-[#034694]/5 relative">
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center px-4 py-8 w-full gap-x-12">
        {/* Right: Verification Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-10 bg-white/95 rounded-3xl shadow-2xl border border-[#034694]/20 max-w-md md:mr-8">
          <h2 className="text-3xl font-extrabold text-center text-black mb-4 tracking-tight">Verify Your Email</h2>
          <p className="text-center text-gray-600 mb-8">
            We've sent a 6-digit verification code to <br />
            <span className="font-semibold text-[#034694]">{userData?.email}</span>
          </p>
          
          <form onSubmit={handleVerification} className="space-y-6">
            <div>
              <label htmlFor="verificationToken" className="block text-base font-semibold text-black mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="verificationToken"
                placeholder="Enter 6-digit code"
                value={verificationToken}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 text-center text-2xl font-mono bg-[#034694]/5 border border-[#034694]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034694] focus:border-[#034694] transition text-black tracking-widest"
                maxLength={6}
                autoComplete="one-time-code"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !verificationToken.trim()}
              className="w-full py-3 px-4 bg-[#034694] hover:bg-[#034694]/80 disabled:bg-gray-400 text-white font-bold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-[#034694] transition text-lg"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendToken}
              disabled={resendLoading || countdown > 0}
              className="text-[#034694] hover:text-[#034694]/80 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {resendLoading 
                ? "Sending..." 
                : countdown > 0 
                  ? `Resend in ${countdown}s` 
                  : "Resend Code"
              }
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/register")}
              className="text-gray-600 hover:text-[#034694] font-medium"
            >
              ← Back to Register
            </button>
          </div>
        </div>

        {/* Left: Illustration */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center h-full md:ml-8">
          <img
            src={registerIllustration}
            alt="Email Verification Illustration"
            className="h-full max-h-[600px] w-auto object-contain drop-shadow-2xl"
            style={{ minHeight: '400px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 