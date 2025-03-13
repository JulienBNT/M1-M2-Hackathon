import React, { useState, useEffect } from "react";
import PostCard from "@/components/post/PostCard";
import { useAuth } from "@/components/contexts/AuthContext";
import { fetchPosts } from "@/components/hooks/usePosts";
import RefreshButton from "@/components/ui/RefreshButton";

function Recommend() {
  const [posts, setPosts] = useState([]);
  const [classification, setClassification] = useState(null);
  const [showComments, setShowComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadPosts();
      loadClassification();
    } else {
      setError("You need to be logged in to view posts.");
    }
  }, [currentUser]);

  const loadPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPosts = await fetchPosts();
      if (currentUser && currentUser.username) {
        // Remove posts by the current user
        const filteredPosts = fetchedPosts.filter(
          (post) => post.author?.username !== currentUser.username
        );
        setPosts(filteredPosts || []);
        setShowComments(new Array(filteredPosts.length).fill(false));
      } else {
        setError("Current user data is missing.");
      }
    } catch (err) {
      console.error("Error loading posts:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadClassification = async () => {
    try {
      const response = await fetch("http://localhost:5000/stop_collection");
      const data = await response.json();
      // Assumes your API returns a "classification" field
      setClassification(data.classification);
    } catch (err) {
      console.error("Error loading classification:", err);
      setError("Failed to load classification.");
    }
  };

  const toggleComments = (postIndex) => {
    const updatedShowComments = [...showComments];
    updatedShowComments[postIndex] = !updatedShowComments[postIndex];
    setShowComments(updatedShowComments);
  };

  // Filter out posts that have any hashtag that appears in the bad_topics
  const recommendedPosts =
    classification && classification.bad_topics
      ? posts.filter((post) => {
          if (!post.hashtags || post.hashtags.length === 0) return true;
          return !post.hashtags.some(tag =>
            classification.bad_topics.hasOwnProperty(tag.toLowerCase())
          );
        })
      : posts;

  return (
    <div className="flex flex-col items-center p-4 space-y-4 w-full max-w-2xl mx-auto">
      {currentUser && currentUser.firstname && currentUser.lastname && (
        <div className="w-full p-4 bg-blue-100 rounded-md shadow-md mb-6">
          <h2 className="text-xl font-semibold text-blue-800">
            Recommended Posts
          </h2>
        </div>
      )}
      <div className="w-full space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : recommendedPosts.length > 0 ? (
          recommendedPosts.map((post, index) => (
            <PostCard
              key={post._id || index}
              post={{ ...post, text: post.content }}
              showCommentsState={showComments[index]}
              onToggleComments={() => toggleComments(index)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recommended posts.
          </div>
        )}
      </div>
      <div className="w-full flex justify-center mt-6">
        <RefreshButton
          onClick={() => {
            loadPosts();
            loadClassification();
          }}
          className="px-4 py-2"
        />
      </div>
    </div>
  );
}

export default Recommend;
