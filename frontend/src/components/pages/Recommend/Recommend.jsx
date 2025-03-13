import React, { useState, useEffect } from "react";
import PostCard from "@/components/post/PostCard";
import { useAuth } from "@/components/contexts/AuthContext";
import { fetchPosts } from "@/components/hooks/usePosts";
import RefreshButton from "@/components/ui/RefreshButton"; // Correct import


function Home() {
  const [posts, setPosts] = useState([]);
  const [showComments, setShowComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPosts = await fetchPosts();
      const filteredPosts = fetchedPosts.filter(post => post.username !== currentUser.username);
      setPosts(filteredPosts || []);
      setShowComments(new Array(filteredPosts.length).fill(false));
    } catch (error) {
      console.error("Error loading posts:", error);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComments = (postIndex) => {
    const updatedShowComments = [...showComments];
    updatedShowComments[postIndex] = !updatedShowComments[postIndex];
    setShowComments(updatedShowComments);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 w-full max-w-2xl mx-auto">
      <div className="w-full space-y-4">
        {isLoading && posts.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post, index) => (
            <PostCard
              key={post._id || index}
              post={{
                ...post,
                text: post.content,
              }}
              showCommentsState={showComments[index]}
              onToggleComments={() => toggleComments(index)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No posts yet.
          </div>
        )}
      </div>

      {/* Refresh Button - Positioned at the bottom center */}
        <div className="w-full flex justify-center mt-6">
            <RefreshButton onClick={loadPosts} className="px-4 py-2" />
        </div>
    </div>
  );
}

export default Home;
