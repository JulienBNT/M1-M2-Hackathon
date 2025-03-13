import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaRegComment,
  FaRegThumbsUp,
  FaThumbsUp,
  FaEllipsisH,
  FaUserCircle,
} from "react-icons/fa";
import { formatDate } from "@/components/utils/dateUtils";

const PostProfile = ({ post }) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.author.username}`}>
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
              {post.author.profilePicture ? (
                <img
                src={
                  post.author?.profilePicture?.startsWith("/")
                    ? `${import.meta.env.VITE_API_URL}${post?.author.profilePicture}`
                    : post?.author.profilePicture
                }
                alt="profile picture"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                  }}
                />
              ) : (
                <FaUserCircle className="w-full h-full text-gray-300" />
              )}
            </div>
          </Link>
          <div>
            <Link
              to={`/profile/${post.author.username}`}
              className="font-semibold text-gray-800 hover:underline"
            >
              {post.author.name}
            </Link>
            <div className="flex gap-2 items-center">
              <p className="text-md text-black-600 font-bold">
                {post.author.firstname} {post.author.lastname}
              </p>
              <p className="text-sm text-gray-500">@{post.author.username}</p>
            </div>
            <p className="text-xs text-gray-500">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
        <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
          <FaEllipsisH className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <p className="text-gray-800 whitespace-pre-line mb-4">{post.content}</p>

        {post.image && (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt="Post"
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      <div className="flex border-t border-gray-100 px-4 py-3">
        <button
          className={`flex items-center space-x-2 py-2 px-4 rounded-md ${
            liked
              ? "text-blue-600 hover:bg-blue-50"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={toggleLike}
        >
          {liked ? (
            <FaThumbsUp className="w-5 h-5" />
          ) : (
            <FaRegThumbsUp className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">Like</span>
        </button>

        <button className="flex items-center space-x-2 py-2 px-4 rounded-md text-gray-600 hover:bg-gray-50">
          <FaRegComment className="w-5 h-5" />
          <span className="text-sm font-medium">Comment</span>
        </button>
      </div>
    </div>
  );
};

export default PostProfile;
