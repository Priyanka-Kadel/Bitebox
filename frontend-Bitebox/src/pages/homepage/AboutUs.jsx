import React from "react";
import mealIcon from "../../assets/images/logo1.png"; 
import { FaMapMarkerAlt, FaLock, FaPiggyBank } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8">
      {/* Hero Card */}
      <section className="w-full mt-24 mb-4 px-4 flex justify-center items-center bg-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 mx-auto">
          {/* Enhanced Hero Card */}
          <div className="relative bg-gradient-to-br from-[#034694] via-[#023a7a] to-[#001450] rounded-[2rem] shadow-[0_20px_60px_rgba(3,70,148,0.3)] backdrop-blur-sm px-16 py-10 flex flex-col justify-center items-start min-w-[450px] max-w-3xl ml-[3cm] overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FFD700]/20 rounded-full blur-lg"></div>
            
            {/* Floating accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-transparent"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <h1 className="text-4xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-xl tracking-tight leading-tight">
                Welcome to The Bitebox!<br />
                Your smart kitchen companion.
              </h1>
              <p className="text-lg md:text-xl text-white mb-6 font-medium leading-snug">
                Skip the grocery trip and get recipes delivered right to your doorstep, so you can cook when it fits your schedule. Plus, pause or cancel any time!
              </p>
              <a
                href="/recipes"
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-all duration-300 hover:bg-white/30 hover:scale-105 text-lg hover:shadow-xl"
              >
                View Recipes
              </a>
            </div>
          </div>
          {/* Hero Image */}
          <img
            src={mealIcon}
            alt="Bitebox Hero"
            className="w-[420px] h-[320px] object-contain"
          />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center mt-16 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#034694] mb-10">Why choose us?</h2>
        <div className="flex flex-col md:flex-row justify-between w-full gap-8">
          {/* Availability */}
          <div className="flex-1 flex flex-col items-center">
            <FaMapMarkerAlt className="w-12 h-12 mb-2 text-gray-800" />
            <span className="font-semibold text-lg text-[#034694]">Availability</span>
            <span className="text-gray-600 text-center text-sm">
              Care handpicked with lots of options for everyone, at affordable prices.
            </span>
          </div>
          {/* Secured */}
          <div className="flex-1 flex flex-col items-center">
            <FaLock className="w-12 h-12 mb-2 text-gray-800" />
            <span className="font-semibold text-lg text-[#034694]">Secured</span>
            <span className="text-gray-600 text-center text-sm">
              Direct communication and secure payment methods for your peace of mind.
            </span>
          </div>
          {/* Savings */}
          <div className="flex-1 flex flex-col items-center">
            <FaPiggyBank className="w-12 h-12 mb-2 text-gray-800" />
            <span className="font-semibold text-lg text-[#034694]">Savings</span>
            <span className="text-gray-600 text-center text-sm">
              Affordable rates and exclusive discounts available for all users.
            </span>
          </div>
        </div>
      </div>

      {/* About Us Box */}
      <div className="w-full max-w-4xl bg-white border border-black rounded-xl p-8 shadow">
        <h2 className="text-2xl font-bold mb-4">About us</h2>
        <p className="text-gray-800 mb-4">
        Bitebox was built to make cooking and grocery planning simpler for everyone. It goes beyond just sharing recipes by delivering pre-measured ingredient bundles for each dish. This helps users cook at home more easily, save time, and avoid food waste.
        </p>
        <p className="text-gray-800 mb-4">
        Our goal is to make the journey from finding a recipe to cooking it as smooth as possible. Instead of switching between websites and writing grocery lists, Bitebox lets you explore new dishes, learn how to make them, and get all the exact ingredients delivered, measured, packed, and ready to use.
        </p>
        <p className="text-gray-800 mb-4">
        We aim to support busy people, students, and home cooks by making cooking easier, quicker, and less wasteful. Bitebox is designed to help you feel more confident in the kitchen—whether you're just starting out or already experienced. From choosing a recipe to plating your meal, we make the whole process simple and enjoyable.
        </p>
        <p className="text-gray-800">
          Thank you for being part of our story. Let’s make cooking simple again.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
