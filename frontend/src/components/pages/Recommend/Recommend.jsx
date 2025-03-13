// src/pages/Recommended.jsx
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import PostCard from "@/components/post/PostCard";
import { useAuth } from "@/components/contexts/AuthContext";
import { fetchPosts } from "@/components/hooks/usePosts";
import RefreshButton from "@/components/ui/RefreshButton";

const socket = io("http://127.0.0.1:5000");

function Recommend() {
  const [posts, setPosts] = useState([]);
  const [classification, setClassification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    socket.on("classification_update", (data) => {
      setClassification(data);
    });
    return () => {
      socket.off("classification_update");
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadPosts();
      loadClassification();
    } else {
      setError("Vous devez être connecté pour voir les posts.");
    }
  }, [currentUser]);

  const loadPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPosts = await fetchPosts();
      if (currentUser && currentUser.username) {
        const otherPosts = fetchedPosts.filter(
          (post) => post.author?.username !== currentUser.username
        );
        setPosts(otherPosts);
      } else {
        setError("Les données utilisateur sont manquantes.");
      }
    } catch (err) {
      console.error("Erreur de chargement des posts:", err);
      setError("Impossible de charger les posts. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadClassification = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/latest_classification");
      const data = await response.json();
      setClassification(data);
    } catch (err) {
      console.error("Erreur lors du chargement de la classification:", err);
      setError("Impossible de charger la classification.");
    }
  };

  // Only include posts that have at least one hashtag classified as "good".
  const recommendedPosts =
    classification && classification.good_hashtags
      ? posts.filter((post) => {
          if (post.hashtags && post.hashtags.length > 0) {
            return post.hashtags.some((tag) =>
              classification.good_hashtags.hasOwnProperty(`#${tag.toLowerCase()}`)
            );
          }
          return false;
        })
      : [];

  return (
    <div className="flex flex-col items-center p-4 space-y-4 w-full max-w-2xl mx-auto">
      <div className="w-full p-4 bg-blue-100 rounded-md shadow-md mb-6">
        <h2 className="text-xl font-semibold text-blue-800">Recommended Posts</h2>
      </div>
      <div className="w-full space-y-4">
        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : recommendedPosts.length > 0 ? (
          recommendedPosts.map((post, index) => (
            <PostCard
              key={post._id || index}
              post={{ ...post, text: post.content }}
              showCommentsState={true}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucun post recommandé. Soyez le premier à publier !
          </div>
        )}
      </div>
      <div className="w-full flex justify-center mt-8">
        <RefreshButton
          onClick={() => {
            loadPosts();
            loadClassification();
          }}
          className="px-6 py-4 text-xl"
        />
      </div>
    </div>
  );
}
export default Recommend;
