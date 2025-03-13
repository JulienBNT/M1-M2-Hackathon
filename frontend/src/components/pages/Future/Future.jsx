import React, { useState, useEffect } from "react";
import PostCard from "@/components/post/PostCard";
import { useAuth } from "@/components/contexts/AuthContext";
import { fetchPosts } from "@/components/hooks/usePosts";
import RefreshButton from "@/components/ui/RefreshButton";

function Future() {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadPost();
  }, []);

  const loadPost = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPosts = await fetchPosts();
      const otherUsersPosts = fetchedPosts.filter(post => post.username !== currentUser.username);

      if (otherUsersPosts.length > 0) {
        const randomPost = otherUsersPosts[Math.floor(Math.random() * otherUsersPosts.length)];
        setPost(randomPost);
      } else {
        setPost(null);
      }
    } catch (error) {
      console.error("Error loading post:", error);
      setError("Failed to load post. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 w-full max-w-4xl mx-auto">
      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : post ? (
        <PostCard
          key={post._id}
          post={{
            ...post,
            text: post.content,
          }}
          className="w-full p-8 shadow-2xl rounded-2xl text-2xl" // Enlarged size
          showCommentsState={true} // Comments always visible
        />
      ) : (
        <div className="text-center py-8 text-gray-500">No posts available.</div>
      )}

      {/* Refresh Button */}
      <div className="w-full flex justify-center mt-8">
        <RefreshButton onClick={loadPost} className="px-6 py-4 text-xl" />
      </div>
    </div>
  );
}

export default Future;
