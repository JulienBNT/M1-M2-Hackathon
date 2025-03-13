import { useState, useEffect } from "react";
import PostProfile from "@/components/pages/Profil/PostsProfile.jsx";
import { FaBookmark } from "react-icons/fa";
import { getUserBookmarks } from "@components/hooks/usePosts.js";
import { useAuth } from "@components/contexts/AuthContext.jsx";
import { Link } from "react-router-dom";

const SavedPosts = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const bookmarkedPosts = await getUserBookmarks();
        setPosts(bookmarkedPosts);
      } catch (error) {
        setError("Error fetching saved posts");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedPosts();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

  return currentUser ? (
    <div>
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FaBookmark className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            You haven't saved any posts yet
          </h3>
          <p className="text-gray-500 mb-4 max-w-md mx-auto">
            Save posts that you want to revisit later by clicking the bookmark
            icon.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Link to={"/"}>Explore posts</Link>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post, index) => (
            <PostProfile key={index} post={{ ...post, text: post.content }} />
          ))}
        </div>
      )}
    </div>
  ) : null;
};

export default SavedPosts;
