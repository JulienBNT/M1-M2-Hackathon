import React, { useState } from "react";
import { FaUserCircle, FaImage, FaHashtag } from "react-icons/fa";
import { useAuth } from "@/components/contexts/AuthContext";

const PostForm = ({ onSubmitPost }) => {
  const { currentUser } = useAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [hashtags, setHashtags] = useState([]);
  const [hashtagInput, setHashtagInput] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const addNewPost = () => {
    if (text || image) {
      const newPost = {
        text,
        hashtags,
        image,
      };

      onSubmitPost(newPost);

      setText("");
      setImage(null);
      setHashtags([]);
      setHashtagInput("");
    }
  };

  const handleAddHashtag = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === ",") {
      e.preventDefault();

      const newHashtag = hashtagInput.trim().replace(/^#+/, "");

      if (newHashtag && !hashtags.includes(newHashtag)) {
        setHashtags([...hashtags, newHashtag]);
      }

      setHashtagInput("");
    }
  };

  const removeHashtag = (tagToRemove) => {
    setHashtags(hashtags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          {currentUser?.profilePicture ? (
            <img
              src={
                currentUser.profilePicture?.startsWith("/")
                  ? `${import.meta.env.VITE_API_URL}${currentUser.profilePicture}`
                  : currentUser.profilePicture
              }
              alt="profile picture"
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUserCircle className="w-full h-full text-gray-300" />
          )}
        </div>
        <div className="w-full">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full text-gray-500 text-lg p-2 outline-none resize-none border-0 bg-transparent"
            rows={2}
          />

          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {hashtags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-sm"
                >
                  <span>#{tag}</span>
                  <button
                    onClick={() => removeHashtag(tag)}
                    className="text-blue-400 hover:text-blue-700 focus:outline-none"
                    aria-label="Remove hashtag"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center px-3 py-2 mt-2 bg-gray-50 rounded-md">
            <FaHashtag className="text-gray-400 mr-2" />
            <input
              type="text"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              onKeyDown={handleAddHashtag}
              placeholder="Add hashtags (press Enter or Space)"
              className="w-full border-0 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {image && (
        <div className="mt-4 rounded-lg overflow-hidden relative">
          <img
            src={image}
            alt="Preview"
            className="w-full object-cover rounded-md"
          />
          <button
            onClick={() => setImage(null)}
            className="absolute top-2 right-2 bg-gray-800 bg-opacity-60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-80"
            aria-label="Remove image"
          >
            &times;
          </button>
        </div>
      )}

      <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-gray-900">
          <div className="flex items-center justify-center w-6 h-6 text-gray-700">
            <FaImage className="w-6 h-6" />
          </div>
          <span className="text-base font-medium">Add Media</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        <button
          onClick={addNewPost}
          className="px-8 py-3 rounded-full bg-blue-800 text-white font-medium text-lg hover:bg-blue-900 transition-colors"
          disabled={!text && !image}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default PostForm;
