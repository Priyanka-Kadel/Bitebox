import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaClock, FaUsers } from "react-icons/fa";
import axios from "axios";

const SavedRecipesPage = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const savedRecipeIds = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        
        if (savedRecipeIds.length === 0) {
          setSavedRecipes([]);
          setLoading(false);
          return;
        }

        // Fetch all recipes and filter for saved ones
        let allRecipesResponse;
        try {
          const token = JSON.parse(localStorage.getItem("user") ?? '{}').token;
          allRecipesResponse = await axios.get(
            "http://localhost:3000/api/recipes",
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {}
            }
          );
        } catch (error) {
          // If auth fails, try without auth
          allRecipesResponse = await axios.get("http://localhost:3000/api/recipes");
        }

        const allRecipes = allRecipesResponse.data;
        const filteredRecipes = allRecipes.filter(recipe => 
          savedRecipeIds.includes(recipe._id)
        );
        
        setSavedRecipes(filteredRecipes);
      } catch (error) {
        console.error("Error fetching saved recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, []);

  const removeFromSaved = (recipeId) => {
    const currentSaved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
    const updatedSaved = currentSaved.filter(id => id !== recipeId);
    localStorage.setItem("savedRecipes", JSON.stringify(updatedSaved));
    setSavedRecipes(prev => prev.filter(recipe => recipe._id !== recipeId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eaf1fa] to-white pt-20">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: '#034694' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf1fa] to-white">
      <div className="pt-20 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Saved Recipes</h1>
            <p className="text-lg text-gray-600">
              Your collection of favorite recipes
            </p>
          </div>

          {/* Recipes Grid */}
          {savedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {savedRecipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Recipe Image */}
                  <div className="relative">
                    <img
                      src={`http://localhost:3000/${recipe.recipeImage}`}
                      alt={recipe.title}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => removeFromSaved(recipe._id)}
                      className="absolute top-3 right-3 bg-[#034694] text-white p-2 rounded-full hover:bg-[#012147] transition-colors"
                      title="Remove from saved"
                    >
                      <FaHeart size={16} />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ₹{recipe.totalPrice}
                    </div>
                  </div>

                  {/* Recipe Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {recipe.description}
                    </p>

                    {/* Recipe Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <FaClock className="mr-1" />
                        <span>{recipe.cookingTime} min</span>
                      </div>
                      <div className="flex items-center">
                        <FaUsers className="mr-1" />
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>

                    {/* View Recipe Button */}
                    <Link
                      to={`/recipe-details/${recipe._id}`}
                      className="block w-full bg-[#034694] hover:bg-[#012147] text-white text-center py-3 rounded-lg font-semibold transition-colors"
                    >
                      View Recipe
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-6 text-gray-300">
                <FaHeart />
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                No saved recipes yet
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Start exploring our delicious recipes and save your favorites to this collection!
              </p>
              <Link
                to="/recipes"
                className="inline-flex items-center px-8 py-4 bg-[#034694] hover:bg-[#012147] text-white font-semibold rounded-lg transition-colors"
              >
                Browse Recipes
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedRecipesPage; 