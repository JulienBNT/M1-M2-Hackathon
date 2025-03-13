import { FaPlus } from "react-icons/fa";

const SuggestedFriends = () => {
  const suggestedFriends = [
    {
      id: 1,
      name: "Olivia Anderson",
      role: "Financial Analyst",
      image: null,
    },
    {
      id: 2,
      name: "Thomas Baker",
      role: "Project Manager",
      image: null,
    },
    {
      id: 3,
      name: "Lily Lee",
      role: "Graphic Designer",
      image: null,
    },
    {
      id: 4,
      name: "Andrew Harris",
      role: "Data Scientist",
      image: null,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden w-full">
      <div className="px-8 py-6 border-b border-gray-100">
        <h2 className="font-bold text-neutral-900 text-2xl">
          Suggested Friends
        </h2>
      </div>

      <div className="p-4">
        {suggestedFriends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center justify-between py-4"
          >
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mr-4 overflow-hidden">
                {friend.image ? (
                  <img
                    src={friend.image}
                    alt={friend.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-medium text-neutral-700 text-xl">
                    {friend.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium text-lg text-neutral-900">
                  {friend.name}
                </div>
                <div className="text-sm text-neutral-600">{friend.role}</div>
              </div>
            </div>
            <button className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-neutral-700 hover:bg-gray-200 transition-colors">
              <FaPlus size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 text-xs text-neutral-500 border-t border-gray-100">
        © 2025 WhispR. All rights reserved.
      </div>
    </div>
  );
};

export default SuggestedFriends;
