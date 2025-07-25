import React, { useEffect, useState } from "react";
import { FaUserPlus, FaUserEdit, FaTrashAlt, FaHome, FaUser, FaUsers, FaSignOutAlt, FaChartBar, FaUtensils } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "tailwindcss/tailwind.css";

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("manageRecipes");
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  // Helper function to get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token) {
      return token;
    } else if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.token;
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
    return null;
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getAuthToken();
        console.log('Fetching users with token:', token ? 'Token exists' : 'No token');
        
        const response = await fetch("https://localhost:3000/api/user/customer", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Users response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Users data:', data);
          // Handle different response structures
          if (data.users) {
            setUsers(data.users);
          } else if (Array.isArray(data)) {
            setUsers(data);
          } else {
            setUsers([]);
          }
        } else {
          console.error('Failed to fetch users:', response.status);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  // Fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = getAuthToken();
        console.log('Fetching recipes with token:', token ? 'Token exists' : 'No token');
        
        const response = await fetch("https://localhost:3000/api/recipes", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Recipes response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Recipes data:', data);
          // Handle different response structures
          if (data.recipes) {
            setRecipes(data.recipes);
          } else if (Array.isArray(data)) {
            setRecipes(data);
          } else {
            setRecipes([]);
          }
        } else {
          console.error('Failed to fetch recipes:', response.status);
          setRecipes([]);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = getAuthToken();
        const response = await fetch(`https://localhost:3000/api/user/delete/${userId}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          setUsers(users.filter((user) => user._id !== userId));
          alert("User deleted successfully");
        } else {
          alert("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    // Find the recipe to get its title for the confirmation message
    const recipe = recipes.find(r => r._id === recipeId);
    setRecipeToDelete(recipe);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRecipe = async () => {
    if (!recipeToDelete) return;
    
    try {
      const token = getAuthToken();
      const response = await fetch(`https://localhost:3000/api/recipes/${recipeToDelete._id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        setRecipes(recipes.filter((recipe) => recipe._id !== recipeToDelete._id));
        toast.success("Recipe deleted successfully");
      } else {
        toast.error("Failed to delete recipe");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error("Failed to delete recipe");
    } finally {
      setShowDeleteConfirm(false);
      setRecipeToDelete(null);
    }
  };

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("user");
    navigate("/");
  };

  const goToDashboard = () => {
    navigate("/");
  };

  if (loading) {
    return (
              <div className="min-h-screen bg-gradient-to-br from-[#034694]/10 via-white to-[#034694]/5 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white pt-20">
      {/* Sidebar */}
      <div className="bg-white shadow-2xl w-64 p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#034694] mb-2 text-center">
            Admin Dashboard
          </h2>
          <div className="flex justify-center space-x-4 text-sm text-gray-600">
            <div className="text-center">
              <div className="font-bold text-[#034694]">{recipes.length}</div>
              <div>Recipes</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-[#034694]">{users.length}</div>
              <div>Users</div>
            </div>
          </div>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveMenu('manageRecipes')}
                className={`w-full px-4 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center
                  ${activeMenu === 'manageRecipes'
                    ? 'bg-[#034694] text-white'
                    : 'bg-[#E6F4EA] text-[#034694] hover:bg-[#c7e7d2]'}
                `}
              >
                <FaUtensils className="mr-3" /> Manage Recipes
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenu('manageUsers')}
                className={`w-full px-4 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center
                  ${activeMenu === 'manageUsers'
                    ? 'bg-[#034694] text-white'
                    : 'bg-[#E6F4EA] text-[#034694] hover:bg-[#c7e7d2]'}
                `}
              >
                <FaUsers className="mr-3" /> Manage Users
              </button>
            </li>
          </ul>
        </nav>

        <div className="space-y-2">
          <Link
            to="/addRecipes"
            className="w-full px-4 py-3 rounded-xl bg-[#034694] hover:bg-[#034694] text-white font-semibold transition-colors flex items-center justify-center"
          >
            <FaUserPlus className="mr-2" /> Add Recipe
          </Link>
          <button
            onClick={goToDashboard}
            className="w-full px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors flex items-center justify-center"
          >
            <FaChartBar className="mr-2" /> Main Dashboard
          </button>
          <button
            onClick={logout}
            className="w-full px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors flex items-center justify-center"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          
          {/* Manage Recipes */}
          {activeMenu === "manageRecipes" && (
            <div>
              <h3 className="text-2xl font-bold text-[#034694] mb-6 flex items-center">
                <FaUtensils className="mr-3" /> Manage Recipes ({recipes.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-[#034694]/5">
                      <th className="px-4 py-3 border border-gray-200 text-left font-semibold">Recipe Image</th>
                      <th className="px-4 py-3 border border-gray-200 text-left font-semibold">Title</th>
                      <th className="px-4 py-3 border border-gray-200 text-left font-semibold">Category</th>
                      <th className="px-4 py-3 border border-gray-200 text-left font-semibold">Prep Time</th>
                      <th className="px-4 py-3 border border-gray-200 text-left font-semibold">Servings</th>
                      <th className="px-4 py-3 border border-gray-200 text-left font-semibold">Price</th>
                      <th className="px-4 py-3 border border-gray-200 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipes.length > 0 ? (
                      recipes.map((recipe, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 border border-gray-200">
                            {recipe.recipeImage && (
                              <img
                                src={`https://localhost:3000/${recipe.recipeImage}`}
                                alt="Recipe"
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            )}
                          </td>
                          <td className="px-4 py-3 border border-gray-200 max-w-xs truncate">
                            {recipe.title}
                          </td>
                          <td className="px-4 py-3 border border-gray-200 capitalize">{recipe.category}</td>
                          <td className="px-4 py-3 border border-gray-200">{recipe.prepTime} min</td>
                          <td className="px-4 py-3 border border-gray-200">{recipe.servings}</td>
                          <td className="px-4 py-3 border border-gray-200 font-semibold">₹{recipe.totalPrice}</td>
                          <td className="px-4 py-3 border border-gray-200">
                            <div className="flex space-x-2">
                              <Link
                                to={{
                                  pathname: `/editRecipe/${recipe._id}`,
                                  state: { recipe },
                                }}
                              >
                                <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-sm flex items-center">
                                  <FaUserEdit className="mr-1" /> Edit
                                </button>
                              </Link>
                              <button
                                onClick={() => handleDeleteRecipe(recipe._id)}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-sm flex items-center"
                              >
                                <FaTrashAlt className="mr-1" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center px-4 py-8 text-gray-500">
                          No recipes available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Manage Users */}
          {activeMenu === "manageUsers" && (
            <div>
              <h3 className="text-2xl font-bold text-[#034694] mb-6 flex items-center">
                <FaUsers className="mr-3" /> Manage Users ({users.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-[#034694]/5">
                      <th className="px-4 py-3 border border-gray-200 text-left font-semibold">Name</th>
                      <th className="px-4 py-3 border border-gray-200 text-left font-semibold">Email</th>
                      <th className="px-4 py-3 border border-gray-200 text-left font-semibold">Role</th>
                      <th className="px-4 py-3 border border-gray-200 text-left font-semibold">Created</th>
                      <th className="px-4 py-3 border border-gray-200 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user, idx) => (
                        <tr key={user._id || idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 border border-gray-200 font-semibold">{user.name}</td>
                          <td className="px-4 py-3 border border-gray-200">{user.email}</td>
                          <td className="px-4 py-3 border border-gray-200">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-[#034694]/10 text-[#034694]'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 border border-gray-200 text-sm">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                          </td>
                          <td className="px-4 py-3 border border-gray-200">
                            <div className="flex space-x-2">
                              <Link to={`/edit-user/${user._id}`}>
                                <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-sm flex items-center">
                                  <FaUserEdit className="mr-1" /> Edit
                                </button>
                              </Link>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-sm flex items-center"
                              >
                                <FaTrashAlt className="mr-1" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center px-4 py-8 text-gray-500">
                          No users available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 w-full max-w-sm rounded-xl shadow-xl flex flex-col">
            <p className="mb-4 text-lg font-semibold text-gray-800">
              Delete "{recipeToDelete?.title}"?
            </p>
            <p className="mb-6 text-sm text-gray-600">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setRecipeToDelete(null);
                }}
                className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteRecipe}
                className="bg-[#034694] hover:bg-[#034694] text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#034694] focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
