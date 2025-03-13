import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUser, FaBell, FaEnvelope, FaBookmark, FaBox, FaStar } from "react-icons/fa";
import coverImage from "@/assets/coverdefault.jpg";
import { useAuth } from "@components/contexts/AuthContext.jsx";

const SideMenu = () => {
  const location = useLocation();
  const { currentUser } = useAuth();

  const navLinks = [
    { path: "/", icon: <FaHome size={22} />, label: "Home" },
    { path: "/profile", icon: <FaUser size={22} />, label: "Profile" },
    { path: "/messages", icon: <FaEnvelope size={22} />, label: "Messages" },
    { path: "/recommand", icon: <FaBox size={22} />, label: "Recommend Post" },
    { path: "/future", icon: <FaStar size={22} />, label: "Future Post" },
    {
      path: "/notifications",
      icon: <FaBell size={22} />,
      label: "Notifications",
    },
  ];

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <aside className="bg-white rounded-2xl shadow-sm overflow-hidden w-full">
      {/* Cover image and profile */}
      <div className="h-40 relative">
        <img
          src={coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400'%3E%3Crect fill='%23f3f4f6' width='800' height='400'/%3E%3Cg fill-opacity='0.1'%3E%3Ccircle fill='%23cccccc' cx='400' cy='200' r='100'/%3E%3C/g%3E%3C/svg%3E";
          }}
        />

        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 rounded-full bg-white p-1.5">
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <img
                src={
                  currentUser?.profilePicture?.startsWith("/")
                    ? `${import.meta.env.VITE_API_URL}${currentUser.profilePicture}`
                    : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fno-picture-profile&psig=AOvVaw2-Wr3YfhEpJasWlYdA0KWC&ust=1741880997904000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPjv9MXyhIwDFQAAAAAdAAAAABAE"
                }
                alt="none"
                className="w-full h-full object-cover p-0 m-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="flex-col pt-20 px-6 pb-4 text-center">
        <div className="font-bold text-neutral-900 text-2xl mb-1">
          {capitalizeWords(currentUser.firstname ?? "")}{" "}
          {capitalizeWords(currentUser.lastname ?? "")}
        </div>
        <div className="text-gray-500 text-sm mb-1 ">
          @{capitalizeWords(currentUser.username)}
        </div>

        <div className="text-base text-neutral-600">{currentUser.email}</div>
      </div>

      {/* Navigation */}
      <div className="px-8 pt-8 pb-8">
        <nav>
          <ul className="space-y-6">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center py-2 transition-colors ${
                    location.pathname === link.path
                      ? "text-blue-800 font-medium"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  <span className="mr-4">{link.icon}</span>
                  <span className="text-lg">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default SideMenu;
