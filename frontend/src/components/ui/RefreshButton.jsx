import React from "react";

const RefreshButton = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-4 text-xl bg-blue-500 text-white font-semibold rounded-2xl shadow-md hover:bg-blue-600 transition-transform transform active:scale-95 ${className}`}
    >
      🔄 Refresh Post
    </button>
  );
};

export default RefreshButton;
