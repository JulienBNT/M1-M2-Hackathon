import { useState, useEffect } from "react";
import PostProfile from "@/components/pages/Profil/PostsProfile.jsx";
import { FaBookmark } from "react-icons/fa";

const SavedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error) {
      return (
        <div className="p-4 text-center text-red-600 bg-red-50 rounded-md">
          <p>{error}</p>
          <button
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
  }, [error]);

  return (
    <div>
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FaBookmark className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Aucun post sauvegardé
          </h3>
          <p className="text-gray-500 max-w-md mb-4">
            You can save posts that you want to revisit later
          </p>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
            Explore posts
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post, index) => (
            <PostProfile key={index} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
