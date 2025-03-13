import { Outlet, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@components/contexts/AuthContext.jsx";
import { useUsers } from "@components/hooks/useUsers.js";

const ProfilePage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");
  const [countPosts, setCountPosts] = useState();
  const { currentUser } = useAuth();
  const { getCountPostsByUser } = useUsers();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/profile/saved")) {
      setActiveTab("saved");
    } else if (path.includes("/profile/settings")) {
      setActiveTab("settings");
    } else {
      setActiveTab("posts");
    }

    const fetchPostCount = async () => {
      if (currentUser?._id) {
        try {
          const data = await getCountPostsByUser(currentUser._id);
          setCountPosts(data);
        } catch (error) {
          console.error("Error fetching posts count:", error);
        }
      }
    };

    fetchPostCount();
  }, [location, currentUser, getCountPostsByUser]);

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={
                currentUser?.profilePicture?.startsWith("/")
                  ? `${import.meta.env.VITE_API_URL}${currentUser.profilePicture}`
                  : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fno-picture-profile&psig=AOvVaw2-Wr3YfhEpJasWlYdA0KWC&ust=1741880997904000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPjv9MXyhIwDFQAAAAAdAAAAABAE"
              }
              alt="profile picture"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                  {currentUser.firstname} {currentUser.lastname}
                </h1>
                <p className="text-gray-500 text-xl mb-1">
                  @{currentUser.username}
                </p>
                <p className="text-gray-600 text-sm italic">
                  {currentUser.bio || "No bio available"}
                </p>
              </div>
            </div>

            <div className="flex justify-center md:justify-start space-x-8 md:space-x-12 mb-3">
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  {countPosts ?? 0}
                </p>
                <p className="text-gray-600 text-sm">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  207
                </p>
                <p className="text-gray-600 text-sm">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  64
                </p>
                <p className="text-gray-600 text-sm">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <Link
          to="/profile"
          className={`px-6 py-4 text-center flex-1 font-medium ${
            activeTab === "posts"
              ? "text-blue-800 border-b-2 border-blue-800 font-semibold"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          My Posts
        </Link>
        <Link
          to="/profile/saved"
          className={`px-6 py-4 text-center flex-1 font-medium ${
            activeTab === "saved"
              ? "text-blue-800 border-b-2 border-blue-800 font-semibold"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          Saved Posts
        </Link>
        <Link
          to="/profile/settings"
          className={`px-6 py-4 text-center flex-1 font-medium ${
            activeTab === "settings"
              ? "text-blue-800 border-b-2 border-blue-800 font-semibold"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          Settings
        </Link>
      </div>

      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfilePage;
