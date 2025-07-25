import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaClock, FaHeart, FaMinus, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SavedRecipes from "../../components/SavedRecipes";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [servings, setServings] = useState(1);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Force refresh by adding a timestamp if not present
    if (!window.location.search) {
      const timestamp = Date.now();
      window.history.replaceState(null, '', `${window.location.pathname}?refresh=${timestamp}`);
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setUser(userObj);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    const fetchData = async () => {
      try {
        let recipeResponse;
        try {
          const token = JSON.parse(localStorage.getItem("user") ?? '{}').token;
          recipeResponse = await axios.get(
            `https://localhost:3000/api/recipes/${id}`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {}
            }
          );
        } catch (error) {
          recipeResponse = await axios.get(
            `https://localhost:3000/api/recipes/${id}`
          );
        }
        setRecipe(recipeResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error loading recipe. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, window.location.search]); // Add location.search to force refresh when URL changes

  // --- Buy Ingredients Functionality ---
  const addToCart = () => {
    if (!user) {
      toast.error("Please log in to add recipes to your cart!");
      navigate("/login");
      return;
    }
    const userCartKey = `cart_${user.id}`;
    const cart = JSON.parse(localStorage.getItem(userCartKey) || "[]");
    const cartItem = {
      recipeId: recipe._id,
      title: recipe.title,
      servings: servings,
      price: recipe.totalPrice * servings,
      image: recipe.recipeImage,
      ingredients: recipe.ingredients.map(ingredient => ({
        ...ingredient,
        quantity: ingredient.quantity * servings
      })),
      addedAt: new Date().toISOString()
    };
    const existingIndex = cart.findIndex(item => item.recipeId === recipe._id);
    if (existingIndex >= 0) {
      cart[existingIndex] = cartItem;
    } else {
      cart.push(cartItem);
    }
    localStorage.setItem(userCartKey, JSON.stringify(cart));
    const event = new CustomEvent('cartUpdated', { detail: cart.length });
    window.dispatchEvent(event);
    toast.success("Recipe added to cart!");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Recipe not found</p>
        <Link to="/recipes" className="text-[#034694] hover:text-[#012147] mt-2 inline-block">
          Back to Recipes
        </Link>
      </div>
    );
  }

  // Helper: split ingredients into 3 columns for desktop
  const getIngredientColumns = (ingredients) => {
    const cols = [[], [], []];
    ingredients.forEach((item, idx) => {
      cols[idx % 3].push(item);
    });
    return cols;
  };

  return (
    <div className="min-h-screen bg-[#fafbfa]">
      {/* Recipe Card Button - above the card, left-aligned */}
      <div className="max-w-5xl mx-auto mt-8 pt-8 mb-8">
        <button className="bg-[#034694] text-white font-bold text-xl px-6 py-2 rounded-lg shadow hover:bg-[#012147] transition">
          Recipe Card
        </button>
      </div>

      {/* Main Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 border border-gray-300 flex flex-col md:flex-row gap-8">
        {/* Left: Text Content */}
        <div className="flex-1 flex flex-col gap-y-6">
          {/* Title & Meta */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-extrabold text-black mb-1">{recipe.title}</h1>
                <span className="text-[#034694] text-xl font-bold">₹{recipe.totalPrice * servings}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <FaClock className="text-lg" />
                <span>{recipe.prepTime} Mins</span>
              </div>
            </div>
            {user && <SavedRecipes recipeId={recipe._id} />}
          </div>
          <p className="text-gray-800 mb-4">{recipe.description}</p>

          {/* Servings */}
          <div>
            <span className="font-bold text-lg block mb-2">Servings</span>
            <div className="flex items-center gap-4">
              <button
                className="w-10 h-10 flex items-center justify-center bg-gray-200 border border-gray-400 rounded font-bold text-xl hover:bg-green-100"
                onClick={() => setServings(s => Math.max(1, s - 1))}
                aria-label="Decrease servings"
              >
                <FaMinus />
              </button>
              <span className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-400 rounded font-bold text-lg">{servings}</span>
              <button
                className="w-10 h-10 flex items-center justify-center bg-gray-200 border border-gray-400 rounded font-bold text-xl hover:bg-green-100"
                onClick={() => setServings(s => (s < 15 ? s + 1 : s))}
                aria-label="Increase servings"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h2 className="font-bold text-xl mb-2">Ingredients</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 text-gray-900">
              {recipe.ingredients && getIngredientColumns(recipe.ingredients).map((col, i) => (
                <ul key={i} className="list-disc list-inside space-y-1">
                  {col.map((item, idx) => (
                    <li key={item._id || idx}>
                      {item.quantity * servings} {item.unit} {item.name}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          {/* Directions/Steps */}
          <div>
            <h2 className="font-bold text-xl mb-2">Directions</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-900">
              {(recipe.directions || recipe.steps || []).map((step, idx) => (
                <li key={idx}>
                  {typeof step === "string"
                    ? step
                    : step.instruction || step.description || JSON.stringify(step)}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right: Image */}
        <div className="flex-shrink-0 flex items-start justify-center">
          <img
            src={recipe.recipeImage ? `https://localhost:3000/${recipe.recipeImage}` : "/src/assets/images/meal.png"}
            alt={recipe.title}
            className="rounded-xl shadow w-[350px] h-[260px] object-cover border border-gray-300"
          />
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="flex justify-center my-8">
        <button
          className="bg-[#034694] text-white text-lg font-bold px-8 py-2 rounded-lg shadow hover:bg-[#012147] transition"
          onClick={addToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default RecipeDetails;






