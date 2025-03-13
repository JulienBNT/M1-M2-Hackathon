// src/pages/Future.jsx
import React, { useState, useEffect } from "react";
import PostCard from "@/components/post/PostCard";
import { useAuth } from "@/components/contexts/AuthContext";
import { fetchPosts } from "@/components/hooks/usePosts";
import RefreshButton from "@/components/ui/RefreshButton";

function Future() {
  const [post, setPost] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [finalData, setFinalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // On mount, load a post and set up a click-outside listener.
  useEffect(() => {
    loadPost();

    const handleClickOutside = (e) => {
      const container = document.getElementById("future-container");
      if (container && !container.contains(e.target)) {
        stopCameraAndFetchFinalData();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Function to stop the camera and fetch final data.
  const stopCameraAndFetchFinalData = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/stop_collection?t=${Date.now()}`,
        { cache: "no-cache" }
      );
      const data = await res.json();
      console.log("Final data:", data);
      setFinalData(data);
    } catch (err) {
      console.error("Error stopping camera:", err);
    }
  };

  // loadPost does the following:
  // 1. Starts the camera.
  // 2. If a current post exists and has at least one hashtag, it captures a snapshot
  //    using the first hashtag (prepended with "#") and saves the returned snapshot data.
  // 3. Loads a new random post from other users.
  const loadPost = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Start the camera with a cache-busting parameter.
      const camRes = await fetch(
        `http://127.0.0.1:5000/start_camera?t=${Date.now()}`,
        { cache: "no-cache" }
      );
      await camRes.json();

      // If there is a current post with hashtags, capture a snapshot.
      if (post && post.hashtags && post.hashtags.length > 0) {
        // Use the first hashtag and prepend a "#"
        const hashtag = `#${post.hashtags[0]}`;
        const detectRes = await fetch(
          `http://127.0.0.1:5000/detect_emotion_once?hashtag=${encodeURIComponent(
            hashtag
          )}&t=${Date.now()}`,
          { cache: "no-cache" }
        );
        const detectData = await detectRes.json();
        console.log("Snapshot data:", detectData);
        setSnapshot(detectData);
      }

      // Load a new random post from other users.
      const fetchedPosts = await fetchPosts();
      const otherUsersPosts = fetchedPosts.filter(
        (p) => p.author?.username !== currentUser.username
      );
      if (otherUsersPosts.length > 0) {
        const randomPost =
          otherUsersPosts[Math.floor(Math.random() * otherUsersPosts.length)];
        setPost(randomPost);
      } else {
        setPost(null);
      }
    } catch (err) {
      console.error("Error loading post:", err);
      setError("Failed to load post. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="future-container"
      className="flex flex-col items-center p-8 w-full max-w-4xl mx-auto space-y-6"
    >
      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : post ? (
        <PostCard
          key={post._id}
          post={{ ...post, text: post.content }}
          className="w-full p-8 shadow-2xl rounded-2xl text-2xl"
          showCommentsState={true}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">No posts available.</div>
      )}
      <div className="w-full flex justify-center mt-8">
        <RefreshButton onClick={loadPost} className="px-6 py-4 text-xl" />
      </div>

      

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
export default Future;
