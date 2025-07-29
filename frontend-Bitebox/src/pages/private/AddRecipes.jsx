import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddRecipes = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "breakfast",
    prepTime: "",
    cookTime: "",
    servings: "",
    totalPrice: "",
    ingredients: [{ name: "", quantity: "", unit: "" }],
    steps: [""]
  });
  const [recipeImage, setRecipeImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const debugToken = () => {
    console.log('=== TOKEN DEBUG ===');
    
    const token1 = sessionStorage.getItem('token');
    const userData = sessionStorage.getItem('user');
    
    console.log('Direct token from sessionStorage:', token1);
    console.log('User data from sessionStorage:', userData);
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('Parsed user object:', user);
        console.log('User token:', user.token);
        console.log('User role:', user.role);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    

    if (token1) {
      try {
        const payload = JSON.parse(atob(token1.split('.')[1]));
        console.log('Token payload:', payload);
        console.log('Token expiration:', new Date(payload.exp * 1000));
        console.log('Current time:', new Date());
        console.log('Is token expired?', Date.now() > payload.exp * 1000);
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    }
    
    console.log('==================');
  };

  const getAuthToken = () => {
    console.log('=== GETTING AUTH TOKEN ===');
    
    const directToken = sessionStorage.getItem('token');
    const userData = sessionStorage.getItem('user');
    
    console.log('Direct token:', directToken ? 'Exists' : 'Not found');
    console.log('User data:', userData ? 'Exists' : 'Not found');
    
    if (directToken) {
      console.log('Using direct token');
      return directToken;
    }
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('Using token from user object');
        return user.token;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    console.log('No token found');
    return null;
  };

  const testToken = async () => {
    const token = getAuthToken();
    
    if (!token) {
      console.log('No token found for testing');
      return;
    }
    
    try {
      console.log('Testing token with a simple API call...');
      const response = await fetch("https://localhost:3000/api/recipes", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Test response status:', response.status);
      
      if (response.ok) {
        console.log('Token is working!');
      } else {
        console.log('Token is not working');
      }
    } catch (error) {
      console.error('Test failed:', error);
    }
  };

  useEffect(() => {
    debugToken();
    testToken();

    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const userObj = JSON.parse(userData);
        setUser(userObj);
        
        if (userObj.role !== 'admin') {
          toast.error("Access denied. Only admins can add recipes.");
          navigate("/");
          return;
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
        navigate("/login");
        return;
      }
    } else {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index][field] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: updatedIngredients
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", quantity: "", unit: "" }]
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        ingredients: updatedIngredients
      }));
    }
  };

  const handleStepChange = (index, value) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index] = value;
    setFormData(prev => ({
      ...prev,
      steps: updatedSteps
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, ""]
    }));
  };

  const removeStep = (index) => {
    if (formData.steps.length > 1) {
      const updatedSteps = formData.steps.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        steps: updatedSteps
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRecipeImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || user.role !== 'admin') {
      toast.error("Access denied. Only admins can add recipes.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getAuthToken();
      
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        navigate("/login");
        return;
      }

      if (!formData.title || !formData.description || !formData.prepTime || 
          !formData.cookTime || !formData.servings || !formData.totalPrice) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      const validIngredients = formData.ingredients.filter(ing => 
        ing.name.trim() && ing.quantity.trim() && ing.unit.trim()
      );
      
      if (validIngredients.length === 0) {
        toast.error("Please add at least one ingredient");
        setIsSubmitting(false);
        return;
      }

      const validSteps = formData.steps.filter(step => step.trim());
      
      if (validSteps.length === 0) {
        toast.error("Please add at least one cooking step");
        setIsSubmitting(false);
        return;
      }

      const formDataToSend = new FormData();
      
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("prepTime", formData.prepTime);
      formDataToSend.append("cookTime", formData.cookTime);
      formDataToSend.append("servings", formData.servings);
      formDataToSend.append("totalPrice", formData.totalPrice);
      
      formDataToSend.append("ingredients", JSON.stringify(validIngredients));
      formDataToSend.append("steps", JSON.stringify(validSteps.map((step, index) => ({
        stepNumber: index + 1,
        instruction: step.trim()
      }))));

      if (recipeImage) {
        formDataToSend.append("recipeImage", recipeImage);
      }

      console.log('Sending recipe data:', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        prepTime: formData.prepTime,
        cookTime: formData.cookTime,
        servings: formData.servings,
        totalPrice: formData.totalPrice,
        ingredients: validIngredients,
        steps: validSteps
      });

      const response = await fetch("https://localhost:3000/api/recipes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Recipe added successfully!");
        navigate("/adminDash");
      } else {
        console.error("Server error:", result);
        toast.error(result.message || "Failed to add recipe");
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      toast.error("Error adding recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Access denied. Only admins can add recipes.</p>
          <button 
            onClick={() => navigate("/")}
            className="mt-4 bg-[#509343] hover:bg-[#0B5A02] text-white px-6 py-2 rounded-lg"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Add New Recipe</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#034694] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#034694] focus:border-transparent"
                  required
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#034694] focus:border-transparent"
                placeholder="Describe your recipe..."
                required
              />
            </div>

            {/* Time and Servings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prep Time (minutes) *
                </label>
                <input
                  type="number"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#034694] focus:border-transparent"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cook Time (minutes) *
                </label>
                <input
                  type="number"
                  name="cookTime"
                  value={formData.cookTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#034694] focus:border-transparent"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servings *
                </label>
                <input
                  type="number"
                  name="servings"
                  value={formData.servings}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#034694] focus:border-transparent"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Price (₹) *
              </label>
              <input
                type="number"
                name="totalPrice"
                value={formData.totalPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#034694] focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Recipe Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Image
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-[#e3eaf6] hover:bg-[#c2d3ec]">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaUpload className="w-8 h-8 mb-4 text-[#034694]" />
                    <p className="mb-2 text-sm text-[#034694]">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-[#034694]">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              {recipeImage && (
                <p className="mt-2 text-sm" style={{ color: '#034694' }}>✓ {recipeImage.name} selected</p>
              )}
            </div>

            {/* Ingredients */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Ingredients *
                </label>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="flex items-center text-[#034694] hover:text-[#034694]"
                >
                  <FaPlus className="mr-1" />
                  Add Ingredient
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Ingredient name"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#034694] focus:border-transparent"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                      className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#034694] focus:border-transparent"
                      min="0"
                      step="0.1"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Unit"
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                      className="w-20 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#034694] focus:border-transparent"
                      required
                    />
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Cooking Steps */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Cooking Steps *
                </label>
                <button
                  type="button"
                  onClick={addStep}
                  className="flex items-center text-[#034694] hover:text-[#034694]"
                >
                  <FaPlus className="mr-1" />
                  Add Step
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#034694] text-white rounded-full flex items-center justify-center font-bold text-sm mt-2">
                      {index + 1}
                    </div>
                    <textarea
                      placeholder={`Step ${index + 1}`}
                      value={step}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#034694] focus:border-transparent"
                      rows="2"
                      required
                    />
                    {formData.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="text-red-500 hover:text-red-700 mt-2"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/adminDash")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#034694] hover:bg-[#034650] disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors duration-200"
              >
                {isSubmitting ? "Adding Recipe..." : "Add Recipe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecipes; 