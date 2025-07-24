import React, { useState } from "react";
import { Link } from "react-router-dom";

const SearchBar = ({ recipes }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      const results = value ? recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(value.toLowerCase()) ||
        recipe.description.toLowerCase().includes(value.toLowerCase())
      ) : [];
      setSearchResults(results.slice(0, 5));
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        onFocus={() => query.trim() && setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        className="w-full px-6 py-4 text-lg rounded-full border-2 border-orange-200 focus:border-orange-500 focus:outline-none shadow-lg"
        placeholder="🔍 Search for recipes..."
      />

      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {searchResults.map((recipe) => (
            <Link
              key={recipe._id}
              to={`/recipe-details/${recipe._id}`}
              className="flex items-center p-4 hover:bg-orange-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
            >
              <img
                src={`http://localhost:3000/${recipe.recipeImage}`}
                alt="Recipe"
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{recipe.title}</h3>
                <p className="text-sm text-gray-600">₹{recipe.totalPrice}</p>
                <p className="text-sm text-gray-500">{recipe.description?.substring(0, 50)}...</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;