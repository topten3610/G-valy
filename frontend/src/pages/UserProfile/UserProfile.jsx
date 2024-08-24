// src/UserProfile.js

import React from "react";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const user = useSelector((state) => state.user.user);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center border-b border-gray-200 pb-6 mb-6">
        <div className="flex-shrink-0">
          <img
            src={user?.profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-200 object-cover"
          />
        </div>
        <div className="ml-6">
          <h1 className="text-3xl font-semibold text-gray-800">{user?.name}</h1>
          <p className="text-gray-600">{user?.email}</p>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
