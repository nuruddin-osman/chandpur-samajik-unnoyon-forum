"use client";

import { FiEdit } from "react-icons/fi";

const UpdateProfile = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 bg-button-bg/10 rounded-2xl flex items-center justify-center mb-4">
        <FiEdit className="text-button-bg text-xl" />
      </div>
      <h3 className="text-base font-semibold text-heading font-playfair mb-1">
        প্রোফাইল আপডেট
      </h3>
      <p className="text-sm text-gray-400">শীঘ্রই আসছে...</p>
    </div>
  );
};

export default UpdateProfile;
