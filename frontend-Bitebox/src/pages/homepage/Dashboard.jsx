import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../../components/Searchbar.jsx";
import { FaWhatsapp, FaClock, FaUsers, FaMapMarkerAlt, FaLock, FaPiggyBank, FaRedo, FaRobot, FaCheck, FaRandom } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [quickMealsIndex, setQuickMealsIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaType, setCaptchaType] = useState('question');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [targetValue, setTargetValue] = useState(0);
  const [sliderTolerance] = useState(5);
  const navigate = useNavigate();

  const questions = [

    {
      type: 'math',
      question: 'What is 7 + 5?',
      answer: '12',
      options: ['10', '11', '12', '13']
    },
    {
      type: 'math',
      question: 'What is 15 - 8?',
      answer: '7',
      options: ['5', '6', '7', '8']
    },
    {
      type: 'math',
      question: 'What is 4 × 6?',
      answer: '24',
      options: ['20', '22', '24', '26']
    },
    {
      type: 'math',
      question: 'What is 20 ÷ 4?',
      answer: '5',
      options: ['4', '5', '6', '8']
    },
    
    {
      type: 'logic',
      question: 'Which color is the sky on a clear day?',
      answer: 'blue',
      options: ['red', 'green', 'blue', 'yellow']
    },
    {
      type: 'logic',
      question: 'How many days are in a week?',
      answer: '7',
      options: ['5', '6', '7', '8']
    },
    {
      type: 'logic',
      question: 'What comes after Monday?',
      answer: 'tuesday',
      options: ['sunday', 'tuesday', 'wednesday', 'friday']
    },
    {
      type: 'logic',
      question: 'Which season comes after summer?',
      answer: 'autumn',
      options: ['spring', 'autumn', 'winter', 'summer']
    },
    
    {
      type: 'food',
      question: 'What color is a ripe banana?',
      answer: 'yellow',
      options: ['green', 'yellow', 'red', 'orange']
    },
    {
      type: 'food',
      question: 'What is the main ingredient in bread?',
      answer: 'flour',
      options: ['sugar', 'flour', 'eggs', 'milk']
    },
    {
      type: 'food',
      question: 'Which fruit is red and round?',
      answer: 'apple',
      options: ['banana', 'apple', 'orange', 'grape']
    },
    {
      type: 'food',
      question: 'What do you use to cut food?',
      answer: 'knife',
      options: ['spoon', 'fork', 'knife', 'plate']
    },
    
    {
      type: 'verification',
      question: 'Are you a human?',
      answer: 'yes',
      options: ['yes', 'no', 'maybe', 'robot']
    },
    {
      type: 'verification',
      question: 'Can you read this text?',
      answer: 'yes',
      options: ['yes', 'no', 'maybe', 'sometimes']
    },
    {
      type: 'verification',
      question: 'Do you want to view recipes?',
      answer: 'yes',
      options: ['yes', 'no', 'maybe', 'later']
    }
  ];

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateRandomQuestion = () => {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const shuffledOptions = shuffleArray(randomQuestion.options);
    
    setCurrentQuestion({
      ...randomQuestion,
      options: shuffledOptions
    });
    setUserAnswer('');
    setError('');
  };

  const generateSliderPuzzle = () => {
    const newTargetValue = Math.floor(Math.random() * 81) + 10;
    setTargetValue(newTargetValue);
    setSliderValue(50);
    setError('');
  };

  const handleViewRecipesClick = (e) => {
    e.preventDefault();
    setShowCaptcha(true);
    
    const randomType = Math.random() < 0.5 ? 'question' : 'slider';
    setCaptchaType(randomType);
    
    if (randomType === 'question') {
      generateRandomQuestion();
    } else {
      generateSliderPuzzle();
    }
  };

  const handleOptionSelect = (option) => {
    setUserAnswer(option);
    setError('');
  };

  const handleSliderChange = (e) => {
    setSliderValue(parseInt(e.target.value));
    setError('');
  };

  const handleCaptchaSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (captchaType === 'question') {
      if (!userAnswer) {
        setError('Please select an answer.');
        setIsLoading(false);
        return;
      }
      
      if (userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
        setTimeout(() => {
          setIsLoading(false);
          setShowCaptcha(false);
          navigate("/recipes");
        }, 500);
      } else {
        setError('Incorrect answer. Please try again.');
        setIsLoading(false);
        setUserAnswer('');
      }
    } else {

      const difference = Math.abs(sliderValue - targetValue);
      if (difference <= sliderTolerance) {
        setTimeout(() => {
          setIsLoading(false);
          setShowCaptcha(false);
          navigate("/recipes");
        }, 500);
      } else {
        setError(`Please move the slider to ${targetValue}. You're ${difference} away.`);
        setIsLoading(false);
      }
    }
  };

  const handleRefresh = () => {
    if (captchaType === 'question') {
      generateRandomQuestion();
    } else {
      generateSliderPuzzle();
    }
  };

  const handleCaptchaCancel = () => {
    setShowCaptcha(false);
    setUserAnswer('');
    setError('');
    setSliderValue(50);
  };

  const switchCaptchaType = () => {
    const newType = captchaType === 'question' ? 'slider' : 'question';
    setCaptchaType(newType);
    
    if (newType === 'question') {
      generateRandomQuestion();
    } else {
      generateSliderPuzzle();
    }
  };

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    fetch("https://localhost:3000/api/recipes", {
      headers: {
        Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user") ?? '{}').token}`
      },
    })
      .then((response) => response.json())
      .then((data) => {

        if (Array.isArray(data)) {
          setRecipes(data);
        } else {
          console.error("API returned non-array data:", data);
          setRecipes([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        setRecipes([]);
      });
  }, []);

  useEffect(() => {
    if (recipes.length > 4) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % (recipes.length - 3));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [recipes.length]);

  const getVisibleRecipes = () => {
    if (!Array.isArray(recipes)) return [];
    return recipes.length <= 4 ? recipes : recipes.slice(activeIndex, activeIndex + 4);
  };
  
  const getVisibleFeaturedRecipes = () => {
    if (!Array.isArray(recipes)) return [];
    return recipes.length <= 4 ? recipes : recipes.slice(featuredIndex, featuredIndex + 4);
  };
  
  const getVisibleQuickMeals = () => {
    if (!Array.isArray(recipes)) return [];
    const quickMeals = recipes.filter(recipe => recipe.prepTime <= 30);
    return quickMeals.length <= 4 ? quickMeals : quickMeals.slice(quickMealsIndex, quickMealsIndex + 4);
  };
  
  const getVisiblePopularRecipes = () => {
    if (!Array.isArray(recipes)) return [];
    const recentRecipes = recipes.slice(0, 4);
    return recentRecipes.length <= 4 ? recentRecipes : recentRecipes.slice(popularIndex, popularIndex + 4);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="w-full mt-24 mb-4 px-4 flex justify-center items-center bg-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-center items-center gap-12">
          {/* Centered, larger Hero Card */}
          <div className="bg-[#034694] rounded-2xl shadow-xl px-24 py-14 flex flex-col justify-center items-start min-w-[600px] max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-xl tracking-tight leading-tight">
              Enjoy hassle-free home cooked meals
            </h1>
            <p className="text-lg md:text-xl text-white mb-6 font-medium leading-snug">
              Skip the grocery trip and get recipes delivered right to your kitchen. Fresh, popular, or curated, all fitting your mood!
            </p>
            <button
              onClick={handleViewRecipesClick}
              className="bg-[#001450] hover:bg-[#012147] text-white font-bold py-4 px-12 rounded-full shadow-md transition-transform hover:scale-105 text-lg"
            >
              View Recipes  
            </button>
          </div>
          {/* Centered, larger image */}
          <img
            src="src\assets\images\meal4.png"
            alt="Hero"
            className="w-[500px] h-[400px] object-contain"
          />
        </div>
      </section>

      {/* Features Row */}
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 py-8 px-4 mt-12">
        <div className="flex flex-col items-center flex-1">
          <FaMapMarkerAlt className="w-12 h-12 mb-2 text-gray-800" />
          <span className="font-semibold text-lg text-[#034694]">Availability</span>
          <span className="text-gray-600 text-center text-sm">Care handpicked with lots of options for everyone, at affordable prices.</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <FaLock className="w-12 h-12 mb-2 text-gray-800" />
          <span className="font-semibold text-lg text-[#034694]">Secured</span>
          <span className="text-gray-600 text-center text-sm">Direct communication and secure payment methods for your peace of mind.</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <FaPiggyBank className="w-12 h-12 mb-2 text-gray-800" />
          <span className="font-semibold text-lg text-[#034694]">Savings</span>
          <span className="text-gray-600 text-center text-sm">Affordable rates and exclusive discounts available for all users.</span>
        </div>
      </div>

      {/* Choose Recipe Section */}
      <section className="mt-4 pt-4 pb-16 px-4 md:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#034694]">
              Choose the recipe that suits your mood!
            </h2>
            <Link to="/recipes" className="text-[#034694] font-semibold hover:underline text-lg">
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {getVisibleRecipes().length > 0 ? getVisibleRecipes().map((recipe, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105"
              >
                <img
                  src={`/api/${recipe.recipeImage}`}
                  alt="Recipe"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-[#034694] mb-1">{recipe.title}</h3>
                  <p className="text-gray-700 text-sm mb-2 flex-1">{recipe.description?.substring(0, 60)}...</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      {recipe.prepTime} min
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="mr-1" />
                      {recipe.servings} servings
                    </div>
                  </div>
                  <Link
                    to={`/recipe-details/${recipe._id}`}
                    className="mt-2 bg-[#034694] hover:bg-[#012147] text-white font-semibold py-2 rounded-lg text-center transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            )) : (
              <p className="col-span-full text-center text-[#034694]">No recipes available.</p>
            )}
          </div>
        </div>
      </section>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/9862242899"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-xl transition hover:scale-110 z-50"
      >
        <FaWhatsapp className="w-8 h-8" />
      </a>

      {/* Custom Captcha Modal */}
      {showCaptcha && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <FaRobot className="text-3xl text-[#034694] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Verify You're Human</h2>
              </div>
              <p className="text-gray-600 mb-6">Please complete this verification to view recipes</p>
              
              {/* Captcha Type Indicator */}
              <div className="flex items-center justify-center mb-4">
                <span className="text-sm text-gray-500 mr-2">
                  {captchaType === 'question' ? 'Question Challenge' : 'Slider Puzzle'}
                </span>
                <button
                  onClick={switchCaptchaType}
                  className="text-[#034694] hover:text-[#012147] transition-colors"
                  title="Switch challenge type"
                >
                  <FaRandom className="text-sm" />
                </button>
              </div>
              
              {captchaType === 'question' ? (
                // Question Captcha
                currentQuestion && (
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {currentQuestion.question}
                    </h3>
                    
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionSelect(option)}
                          className={`w-full p-3 rounded-lg border-2 transition-all ${
                            userAnswer === option
                              ? 'border-[#034694] bg-[#034694] text-white'
                              : 'border-gray-300 hover:border-[#034694] hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{option}</span>
                            {userAnswer === option && <FaCheck className="text-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                // Slider Captcha
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Move the slider to {targetValue}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>0</span>
                      <span className="font-semibold text-[#034694]">Target: {targetValue}</span>
                      <span>100</span>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderValue}
                        onChange={handleSliderChange}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #034694 0%, #034694 ${sliderValue}%, #e5e7eb ${sliderValue}%, #e5e7eb 100%)`
                        }}
                      />
                      <div className="absolute top-0 left-0 w-full h-3 pointer-events-none">
                        <div 
                          className="h-3 bg-[#034694] rounded-lg transition-all duration-200"
                          style={{ width: `${sliderValue}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <span className="text-2xl font-bold text-[#034694]">{sliderValue}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleCaptchaSubmit} className="space-y-4">
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleCaptchaCancel}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || (captchaType === 'question' && !userAnswer)}
                    className="flex-1 bg-[#034694] hover:bg-[#012147] disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </>
                    ) : (
                      'Verify & Continue'
                    )}
                  </button>
                </div>
              </form>
              
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="mt-4 text-[#034694] hover:text-[#012147] transition-colors flex items-center justify-center mx-auto"
                title={captchaType === 'question' ? "Get a new question" : "Get a new target"}
              >
                <FaRedo className="mr-2" />
                {captchaType === 'question' ? 'New Question' : 'New Target'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;