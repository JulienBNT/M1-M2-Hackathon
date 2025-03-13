import React, { useState, useEffect } from "react";
import PostForm from "@/components/post/PostForm";
import PostCard from "@/components/post/PostCard";
import { useAuth } from "@/components/contexts/AuthContext";
import { fetchPosts, createPost } from "@/components/hooks/usePosts";

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
      setPosts(fetchedPosts || []);
      setShowComments(new Array(fetchedPosts.length).fill(false));
    } catch (error) {
      console.error("Error loading posts:", error);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPost = async (newPost) => {
    try {
      await createPost(newPost);
      await loadPosts();
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const toggleComments = (postIndex) => {
    const updatedShowComments = [...showComments];
    updatedShowComments[postIndex] = !updatedShowComments[postIndex];
    setShowComments(updatedShowComments);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 w-full max-w-2xl mx-auto">
      <PostForm onSubmitPost={handleSubmitPost} />

      <div className="w-full space-y-4">
        {isLoading && posts.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-800 mx-auto"></div>
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
            No posts yet. Be the first to create a post!
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
