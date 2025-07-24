

import React from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-transparent py-16 flex justify-center">
    <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full px-12 py-14 flex flex-col md:flex-row justify-between items-start gap-16">
      {/* Contact Info */}
      <div className="flex flex-col md:flex-row gap-16 flex-1">
        {/* Address */}
        <div className="flex items-start gap-3">
          <span className="bg-[#034694] rounded-full p-2 flex items-center justify-center">
            <FaMapMarkerAlt className="text-white w-5 h-5" />
          </span>
          <div>
            <div className="text-sm text-gray-700">Address</div>
            <div className="font-bold text-black">Dilibazaar, Kathmandu, Nepal</div>
          </div>
        </div>
        {/* Email */}
        <div className="flex items-start gap-3">
          <span className="bg-[#034694] rounded-full p-2 flex items-center justify-center">
            <FaEnvelope className="text-white w-5 h-5" />
          </span>
          <div>
            <div className="text-sm text-gray-700">Email</div>
            <div className="font-bold text-black">bitebox2121@gmail.com</div>
          </div>
        </div>
        {/* Phone */}
        <div className="flex items-start gap-3">
          <span className="bg-[#034694] rounded-full p-2 flex items-center justify-center">
            <FaPhone className="text-white w-5 h-5" />
          </span>
          <div>
            <div className="text-sm text-gray-700">Phone</div>
            <div className="font-bold text-black">+9745709544</div>
          </div>
        </div>
      </div>
      {/* Description */}
      <div className="flex-1">
        <div className="font-bold mb-2">Everything You Need, All In One Box</div>
        <div className="text-sm text-gray-700">
          Discover a world of delicious possibilities with Bitebox. Enjoy easy-to-follow instructions, fresh ideas, and a community passionate about great food, right at your fingertips.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
