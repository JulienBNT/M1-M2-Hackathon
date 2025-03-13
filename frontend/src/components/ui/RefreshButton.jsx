import React from "react";

const RefreshButton = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition ${className}`}
    >
      Refresh 🔄
    </button>
  );
};

export default RefreshButton;
