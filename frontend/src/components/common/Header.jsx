import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-100 fixed w-full z-10">
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-800">WispR</span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-200 focus:outline-none focus:border-gray-300 bg-gray-50 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search size={18} />
            </div>
          </form>
        </div>

        <div className="flex items-center">
          <button
            onClick={handleLogout}
            className="text-neutral-800 text-sm font-medium"
          >
            Logout
          </button>
          <Link to="/profile" className="ml-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <span className="font-medium text-neutral-700">R</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
