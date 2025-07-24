import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";

const SavedRecipes = ({ recipeId }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
    setIsSaved(savedRecipes.includes(recipeId));
  }, [recipeId]);

  const toggleSaved = () => {
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
    
    if (isSaved) {
      const updatedSavedRecipes = savedRecipes.filter(id => id !== recipeId);
      localStorage.setItem("savedRecipes", JSON.stringify(updatedSavedRecipes));
      setIsSaved(false);
    } else {
      savedRecipes.push(recipeId);
      localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
      setIsSaved(true);
    }
  };

  return (
    <button
      onClick={toggleSaved}
      className={`p-2 rounded-full transition-colors duration-200 ${
        isSaved 
          ? 'bg-[#034694] text-white hover:bg-[#034694]' 
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      }`}
      title={isSaved ? "Remove from saved" : "Save recipe"}
    >
      <FaHeart size={16} />
    </button>
  );
};

export default SavedRecipes; 