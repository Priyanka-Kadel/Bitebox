import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaArrowLeft,
  FaEnvelope,
  FaIdCard,
  FaCalendarAlt,
  FaPhone,
  FaCrown
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";

const styles = `
  .fade-in-section {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeIn 0.6s ease-out forwards;
  }
  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const timeout = setTimeout(() => setIsVisible(true), 100);

    return () => {
      document.head.removeChild(styleSheet);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = sessionStorage.getItem('user');
        if (!storedUser) {
          setError('No authentication found. Please log in.');
          setLoading(false);
          return;
        }
        const userData = JSON.parse(storedUser);
        if (userData.email || userData.name) {
          setUser(userData);
        } else {
          setError('Invalid user data. Please log in again.');
        }
      } catch {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => setShowLogoutModal(true);

  const handleGoBack = () => {
    navigate(-1);
  };

  const gradientBg = "bg-gradient-to-br from-[#E6F4EA] via-white to-[#c7e7d2]";
  const glassCard = "backdrop-blur-lg bg-white/70 border border-[#034694]/20 shadow-2xl";
  const borderGreen = "border-[#034694]/30";

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${gradientBg}`}>
        <div className="max-w-md w-full p-6 rounded-2xl shadow-lg bg-white animate-pulse">
          <div className="h-24 w-24 mx-auto rounded-full bg-gray-200 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-2" />
          <div className="space-y-2 mt-4">
            <div className="h-3 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${gradientBg}`}>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <FaUserCircle className="text-red-500 text-5xl mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex justify-center gap-4">
            <button onClick={handleGoBack} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">
              <FaArrowLeft className="inline mr-2" /> Go Back
            </button>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
              <FaSignOutAlt className="inline mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-32 pb-16 flex items-center justify-center ${gradientBg}`}>
      <div className="relative w-full max-w-lg mx-auto">
        {/* Decorative blurred circles */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-[#034694]/20 rounded-full blur-2xl z-0" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-[#034694]/20 rounded-full blur-2xl z-0" />

        {/* Profile Card */}
        <div className={`relative z-10 ${glassCard} rounded-3xl px-10 pt-24 pb-12 flex flex-col items-center ${isVisible ? "fade-in-section" : ""}`}>
          {/* Floating Avatar */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2">
            <div className="w-36 h-36 rounded-full border-8 border-white bg-[#034694] flex items-center justify-center shadow-xl text-white text-8xl">
              <FaUserCircle />
            </div>
            {user?.role === "admin" && (
              <div className="absolute bottom-3 right-3 bg-yellow-500 p-1 rounded-full shadow-md">
                <FaCrown className="text-white text-xs" />
              </div>
            )}
          </div>

          {/* Name and Email */}
          <h1 className="mt-16 text-3xl font-extrabold text-[#034694] text-center drop-shadow-sm">{user?.name || "User"}</h1>
          <p className="text-md text-gray-500 text-center mb-2">{user?.email}</p>
          <span className="mb-8 text-xs bg-[#E6F4EA] text-[#034694] px-5 py-1 rounded-full font-medium border border-[#034694]/30 shadow">
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || "User"}
          </span>

          {/* Profile Details */}
          <div className="w-full mt-2 space-y-4">
            <ProfileRow icon={<FaIdCard />} label="User ID" value={user?.id || user?._id} />
            <ProfileRow icon={<FaCalendarAlt />} label="Created" value={moment(user?.createdAt).format("MMM DD, YYYY")} />
            <ProfileRow icon={<FaCalendarAlt />} label="Updated" value={moment(user?.updatedAt).format("MMM DD, YYYY")} />
            {user?.phone && <ProfileRow icon={<FaPhone />} label="Phone" value={user.phone} />}
          </div>

          {/* Online Status */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center px-5 py-1 bg-[#E6F4EA] border border-[#034694]/30 text-[#034694] rounded-full shadow">
              <div className="w-2 h-2 bg-[#034694] rounded-full mr-2 animate-ping"></div>
              Online
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex justify-center gap-4 w-full">
            <button
              onClick={handleGoBack}
              className="flex-1 flex items-center justify-center bg-white border border-[#034694] text-[#034694] hover:bg-[#E6F4EA] font-semibold px-4 py-2 rounded-xl transition shadow"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition shadow"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-10 w-full max-w-md md:max-w-lg rounded-2xl shadow-2xl flex flex-col">
            <p className="mb-8 text-xl font-semibold text-gray-800">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-4 mt-2">
              <button
                onClick={() => {
                  localStorage.clear();
                  setShowLogoutModal(false);
                  toast.success("Logged out successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                  });
                  navigate("/login");
                }}
                className="bg-[#034694] hover:bg-[#034694] text-white px-6 py-2 rounded-lg font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#034694] focus:ring-offset-2"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
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

const ProfileRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-white/60 hover:bg-[#E6F4EA] rounded-xl px-5 py-3 transition">
    <span className="text-[#034694] text-lg">{icon}</span>
    <span className="text-gray-500 font-medium w-28">{label}</span>
    <span className="text-gray-800 font-semibold flex-1 text-right break-all">{value || "-"}</span>
  </div>
);

export default Profile;