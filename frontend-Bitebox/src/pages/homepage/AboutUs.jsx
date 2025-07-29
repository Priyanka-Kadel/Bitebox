import React from "react";
import mealIcon from "../../assets/images/logo1.png"; 
import { FaMapMarkerAlt, FaLock, FaPiggyBank } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8">
      {/* Hero Card */}
      <section className="w-full mt-24 mb-4 px-4 flex justify-center items-center bg-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 mx-auto">
          {/* Hero Card */}
          <div className="bg-[#034694] rounded-2xl shadow-xl px-16 py-10 flex flex-col justify-center items-start min-w-[450px] max-w-3xl ml-[3cm]">
            <h1 className="text-4xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-xl tracking-tight leading-tight">
              Welcome to The Bitebox!<br />
              Your smart kitchen companion.
            </h1>
            <p className="text-lg md:text-xl text-white mb-6 font-medium leading-snug">
              Skip the grocery trip and get recipes delivered right to your doorstep, so you can cook when it fits your schedule. Plus, pause or cancel any time!
            </p>
            <a
              href="/recipes"
              className="bg-[#001450] hover:bg-[#012147] text-white font-bold py-3 px-10 rounded-full shadow-md transition-transform hover:scale-105 text-lg"
            >
              View Recipes
            </a>
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
          The Bitebox was created to simplify the way people cook and shop for food. This is designed to offer more than just recipes. We provide ready-to-cook ingredient bundles tailored to each recipe, making home cooking easier, faster, and waste-free.
        </p>
        <p className="text-gray-800 mb-4">
          Our mission is to bridge the gap between food inspiration and action. No more jumping between recipe sites and grocery lists. With The Bitebox, you can discover dishes, learn how to cook them, and instantly order all the ingredients you need, measured and ready to go.
        </p>
        <p className="text-gray-800 mb-4">
          We’re focused on helping busy individuals, students, and home cooks save time, reduce food waste, and gain confidence in the kitchen. Whether you're a beginner or a seasoned cook, The Bitebox offers a smooth, enjoyable experience from recipe selection to your final dish.
        </p>
        <p className="text-gray-800">
          Thank you for being part of our story. Let’s make cooking simple again.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
