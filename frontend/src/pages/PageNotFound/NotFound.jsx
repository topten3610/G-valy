import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-gray-50 px-4 md:px-0">
      <div className="text-center space-y-6 md:space-y-8">
        {/* 404 Text */}
        <h1 className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-orange-600 animate-pulse">
          404
        </h1>

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-gray-800">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-2 text-base md:text-lg lg:text-xl text-gray-600 max-w-md md:max-w-xl mx-auto leading-relaxed">
          The page you're looking for doesn't exist. You may have mistyped the
          URL or the page might have been moved.
        </p>

        {/* Back to Home Button */}
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-5 md:px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold text-base md:text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <FaHome className="mr-2" /> Back to Home
          </Link>
        </div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute bottom-0 left-0 w-40 h-40 md:w-64 md:h-64 bg-yellow-400 rounded-full opacity-20 mix-blend-multiply filter blur-2xl animate-bounce delay-1000"></div>
      <div className="absolute bottom-20 right-0 w-40 h-40 md:w-64 md:h-64 bg-red-400 rounded-full opacity-20 mix-blend-multiply filter blur-2xl animate-bounce"></div>
    </div>
  );
};

export default NotFound;
