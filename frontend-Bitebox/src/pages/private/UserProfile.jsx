// UserProfile.jsx
import React, { useEffect, useState } from "react";
import { FaUserCircle, FaEdit, FaSignOutAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get user data from localStorage
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            
            // Check if we have valid user data with email
            if (userData.email && userData.name) {
              setUser(userData);
              setLoading(false);
              return;
            }
          } catch (e) {
            // Continue to API fetch if localStorage parsing fails
          }
        }

        // If no valid stored user data, try to fetch from API using token from user object
        const storedUserObj = storedUser ? JSON.parse(storedUser) : null;
        const token = storedUserObj?.token || localStorage.getItem('token');
        
        if (token) {
          const endpoints = [
            "http://localhost:3000/api/user/profile",
            "http://localhost:3000/api/user/me",
            "http://localhost:3000/api/auth/profile",
            "http://localhost:3000/api/user/customer"
          ];

          let userData = null;

          for (const endpoint of endpoints) {
            try {
              const response = await fetch(endpoint, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              if (response.ok) {
                const data = await response.json();

                // Handle different possible response structures
                if (data.user) {
                  userData = data.user;
                  break;
                } else if (data.users && data.users.length > 0) {
                  // For the customer endpoint, find the current user by email
                  const currentUserEmail = storedUserObj?.email;
                  const currentUser = data.users.find(u => u.email === currentUserEmail);
                  userData = currentUser || data.users[0];
                  break;
                } else if (data.data) {
                  userData = data.data;
                  break;
                } else if (data.email) {
                  userData = data;
                  break;
                }
              }
            } catch (endpointError) {
              // Continue to next endpoint if current one fails
            }
          }

          if (userData) {
            // Merge with stored data to preserve token and ensure we have all fields
            const mergedUserData = { 
              ...userData, 
              token: token,
              email: userData.email || storedUserObj?.email,
              name: userData.name || storedUserObj?.name,
              role: userData.role || storedUserObj?.role,
              id: userData.id || userData._id || storedUserObj?.id
            };
            setUser(mergedUserData);
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(mergedUserData));
          } else {
            setError('Unable to fetch user data. Please log in again.');
          }
        } else {
          setError('No authentication token found. Please log in.');
        }
      } catch (error) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-white to-primary/5">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <div className="animate-pulse">
            <div className="w-28 h-28 rounded-full bg-gray-200 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-white to-primary/5">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-red-500 mb-4">
            <FaUserCircle size={64} className="mx-auto mb-2" />
            <h2 className="text-xl font-bold">Error Loading Profile</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={handleGoBack}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Go Back
            </button>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-white to-primary/5 py-12">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-primary">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center px-3 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleEditProfile}
              className="flex items-center px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
            >
              <FaEdit className="mr-2" /> Edit
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center mb-4 shadow-lg">
            <FaUserCircle className="text-primary" size={90} />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-1">
            {user?.name || "User"}
          </h2>
          <p className="text-base text-primary mb-2">
            {user?.email || "user@email.com"}
          </p>
          <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full font-semibold text-xs mb-2">
            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
          </span>
        </div>
        
        <div className="bg-primary/5 rounded-xl p-6 shadow-inner">
          <h3 className="text-lg font-semibold text-primary mb-4">Profile Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-primary/10">
              <span className="font-bold text-primary">Name:</span>
              <span className="text-primary">{user?.name || "-"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-primary/10">
              <span className="font-bold text-primary">Email:</span>
              <span className="text-primary">{user?.email || "-"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-primary/10">
              <span className="font-bold text-primary">Role:</span>
              <span className="text-primary">{user?.role || "-"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-primary/10">
              <span className="font-bold text-primary">User ID:</span>
              <span className="text-primary text-sm">{user?.id || user?._id || "-"}</span>
            </div>
            {user?.createdAt && (
              <div className="flex justify-between items-center py-2 border-b border-primary/10">
                <span className="font-bold text-primary">Created:</span>
                <span className="text-primary text-sm">{moment(user.createdAt).format('MMM DD, YYYY')}</span>
              </div>
            )}
            {user?.updatedAt && (
              <div className="flex justify-between items-center py-2">
                <span className="font-bold text-primary">Updated:</span>
                <span className="text-primary text-sm">{moment(user.updatedAt).format('MMM DD, YYYY')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional user info if available */}
        {user?.phone && (
          <div className="mt-4 bg-primary/5 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-primary mb-2">Contact Information</h4>
            <div className="flex justify-between items-center">
              <span className="font-bold text-primary">Phone:</span>
              <span className="text-primary">{user.phone}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;