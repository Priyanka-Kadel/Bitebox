import React from "react";
import mealIcon from "../../assets/images/logo1.png";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8">
      {/* Hero Section */}
      <section className="w-full mt-24 mb-4 px-4 flex justify-center items-center bg-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full">
          {/* Enhanced Hero Card */}
          <div className="relative bg-gradient-to-br from-[#034694] via-[#023a7a] to-[#001450] rounded-[2rem] shadow-[0_20px_60px_rgba(3,70,148,0.3)] backdrop-blur-sm px-16 py-10 flex flex-col justify-center items-start min-w-[420px] max-w-[690px] ml-[4cm] overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FFD700]/20 rounded-full blur-lg"></div>
            
            {/* Floating accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-transparent"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <h1 className="text-4xl md:text-3xl font-extrabold text-white mb-4 drop-shadow-xl tracking-tight leading-tight text-left">
                Help Center<br />
                Got questions? We've got answers.
              </h1>
              <p className="text-lg md:text-xl text-white mb-6 font-medium leading-snug text-left">
                Whether you're exploring recipes, adjusting serving sizes, or trying to order ingredients, this section will walk you through everything you need to know.
              </p>
              <a
                href="/"
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-all duration-300 hover:bg-white/30 hover:scale-105 text-lg hover:shadow-xl"
              >
                Back to Home
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <img
            src={mealIcon}
            alt="Help Icon"
            className="w-[380px] h-[280px] object-contain"
          />
        </div>
      </section>

      {/* FAQ Box */}
      <div className="w-full max-w-4xl bg-white border border-black rounded-xl p-8 shadow mt-[1cm]">
        <h2 className="text-2xl font-bold mb-4">Help & FAQ</h2>
        <p className="text-gray-800 mb-4">Need a hand? You’re in the right place.</p>
        <p className="text-gray-800 mb-4">
          Welcome to The Bitebox Help Center. Below are some common questions and answers to help you get started and make the most out of our application.
        </p>
        <p className="text-gray-800 mb-4">
          📖 How do I view a recipe?
          <br />
          Simply browse or search for any recipe on the homepage. Tap on a recipe card to view full details, including ingredients, steps, and cooking time.
        </p>
        <p className="text-gray-800 mb-4">
          🛒 How does the “Buy Ingredients” feature work?
          <br />
          Each recipe includes an option to purchase all the exact ingredients needed. Just tap “Add to cart” and you’ll be directed to a pre-filled shopping cart with everything measured and ready. Checkout, and you’re done!
        </p>
        <p className="text-gray-800 mb-4">
          🍽️ Can I adjust the serving size?
          <br />
          Yes! You can select the number of servings, and the ingredient list will automatically update to match the chosen portion. This helps avoid waste and ensures you get just the right amount.
        </p>
        <p className="text-gray-800 mb-4">
          ⏱️ Where can I find the cooking time?
          <br />
          Each recipe includes both preparation and cooking time, listed right at the top for easy planning.
        </p>
        <p className="text-gray-800">
          💾 Can I save my favorite recipes?
          <br />
          Just click on the favorite (heart) option beside the recipe card and you’re good to go!
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
