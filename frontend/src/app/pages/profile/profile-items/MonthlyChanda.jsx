"use client";

import { FiDollarSign } from "react-icons/fi";

const MonthlyChanda = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 bg-button-bg/10 rounded-2xl flex items-center justify-center mb-4">
        <FiDollarSign className="text-button-bg text-xl" />
      </div>
      <h3 className="text-base font-semibold text-heading font-playfair mb-1">
        মাসিক চাঁদা
      </h3>
      <p className="text-sm text-gray-400">শীঘ্রই আসছে...</p>
    </div>
  );
};

export default MonthlyChanda;
