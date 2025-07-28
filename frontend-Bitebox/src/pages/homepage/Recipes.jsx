import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaClock, FaUsers, FaSearch, FaFilter } from "react-icons/fa";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    // Fetch recipes - try with auth first, then without
    const fetchRecipes = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("user") ?? '{}').token;
        const response = await fetch("https://localhost:3000/api/recipes", {
          headers: token ? {
            Authorization: `Bearer ${token}`
          } : {}
        });
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    
    fetchRecipes();
  }, []);

  // Get unique categories for dropdown
  const categories = ['breakfast', 'lunch', 'dinner'];

  // Filtering logic
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(search.toLowerCase()) ||
      recipe.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? recipe.category === category : true;
    let matchesPrepTime = true;
    if (prepTime === "quick") matchesPrepTime = recipe.prepTime <= 30;
    else if (prepTime === "medium") matchesPrepTime = recipe.prepTime > 30 && recipe.prepTime <= 60;
    else if (prepTime === "long") matchesPrepTime = recipe.prepTime > 60;
    return matchesSearch && matchesCategory && matchesPrepTime;
  });

  // Sorting logic
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === "price") return a.totalPrice - b.totalPrice;
    else if (sortBy === "time") return a.prepTime - b.prepTime;
    else if (sortBy === "name") return a.title.localeCompare(b.title);
    else return 0; // Default: no sorting
  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-[#034694] mt-4">All Recipes</h1>
      
      {/* Filter Bar */}
      <div className="bg-[#eaf1fa] p-6 rounded-2xl shadow-lg mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipes by title or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#034694]/30 focus:outline-none focus:ring-2 focus:ring-[#034694] focus:border-transparent"
            />
          </div>
          
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-4 py-3 rounded-xl border border-[#034694]/30 focus:outline-none focus:ring-2 focus:ring-[#034694] focus:border-transparent bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat} className="capitalize">{cat}</option>
            ))}
          </select>
          
          <select
            value={prepTime}
            onChange={e => setPrepTime(e.target.value)}
            className="px-4 py-3 rounded-xl border border-[#034694]/30 focus:outline-none focus:ring-2 focus:ring-[#034694] focus:border-transparent bg-white"
          >
            <option value="">All Prep Times</option>
            <option value="quick">Quick (≤30 min)</option>
            <option value="medium">Medium (31-60 min)</option>
            <option value="long">Long (60 min)</option>
          </select>
          
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl border border-[#034694]/30 focus:outline-none focus:ring-2 focus:ring-[#034694] focus:border-transparent bg-white"
          >
            <option value="">Sort By</option>
            <option value="name">Name (A-Z)</option>
            <option value="price">Price (Low to High)</option>
            <option value="time">Prep Time (Quick to Long)</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          Showing {sortedRecipes.length} recipe{sortedRecipes.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2 text-[#034694]">
          <FaFilter />
          <span className="text-sm font-medium">Filters Applied</span>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedRecipes.length > 0 ? (
          sortedRecipes.map((recipe) => (
            <Link 
              key={recipe._id} 
              to={`/recipe-details/${recipe._id}`}
              className="block bg-white p-4 rounded-xl shadow-lg border border-[#034694]/10 hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <div className="relative">
                <img 
                  src={`/api/${recipe.recipeImage}`} 
                  alt={recipe.title} 
                  className="w-full h-48 object-cover rounded-lg mb-3 transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute top-2 left-2 bg-white/90 px-3 py-1 rounded-full text-sm font-bold text-[#034694] shadow">
                  ₹{recipe.totalPrice}
                </div>
                <div className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-sm font-bold text-gray-700 shadow">
                  {recipe.category}
                </div>
              </div>
              
              <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{recipe.title}</h2>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <FaClock className="mr-1 text-[#034694]" />
                  {recipe.prepTime} min
                </div>
              </div>
              
              <div className="w-full bg-[#034694] hover:bg-[#012147] text-white text-center py-2 rounded-lg font-semibold transition-colors duration-200">
                View Recipe
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍳</div>
            <p className="text-gray-600 text-lg mb-2">No recipes found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Load More Button (if needed) */}
      {sortedRecipes.length > 0 && (
        <div className="text-center mt-8">
          <button className="bg-[#eaf1fa] hover:bg-[#c2d3ec] text-[#034694] px-6 py-3 rounded-xl font-semibold transition-colors duration-200">
            Load More Recipes
          </button>
        </div>
      )}
    </div>
  );
};

export default Recipes; 