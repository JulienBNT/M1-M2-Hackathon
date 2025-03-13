import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaThumbsUp,
  FaComment,
  FaEllipsisH,
} from "react-icons/fa";
import { formatDate } from "@/components/utils/dateUtils";
import { useAuth } from "@/components/contexts/AuthContext";

const PostCard = ({
  post,
  onLike,
  onAddComment,
  onReplyComment,
  showCommentsState,
  onToggleComments,
}) => {
  const { currentUser } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  const handleReplyComment = (commentIndex) => {
    if (replyText.trim()) {
      onReplyComment(commentIndex, replyText);
      setReplyText("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 overflow-hidden">
      {post && (
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
              {post.author.profilePicture ? (
                <img
                  src={
                    post.author?.profilePicture?.startsWith("/")
                      ? `${import.meta.env.VITE_API_URL}${post?.author.profilePicture}`
                      : "https://img.freepik.com/free-vector/hand-drawn-side-profile-cartoon-illustration_23-2150517171.jpg?t=st=1741690774~exp=1741694374~hmac=5ddd578f5fb77fc50f0c82a4180ee1ec4004b3459c6d620b014f91aa75a60a61&w=900"
                  }
                  alt="profile picture"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-full h-full text-gray-300" />
              )}
            </div>
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
      )}

      <div className="p-4">
        <p className="text-gray-800 mb-4">{post.text}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className="w-full rounded-lg object-cover"
          />
        )}

        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {post.hashtags.map((tag, idx) => (
              <span key={idx} className="text-blue-600 text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex border-t border-gray-100 px-4 py-3">
        <button
          onClick={onLike}
          className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
        >
          <FaThumbsUp className="w-5 h-5" />
          <span>{post.likes}</span>
          <span>Like</span>
        </button>
        <button
          onClick={onToggleComments}
          className="flex items-center space-x-2 ml-4 text-gray-600 hover:text-blue-600"
        >
          <FaComment className="w-5 h-5" />
          <span>Comment</span>
        </button>
      </div>

      {showCommentsState && (
        <div className="border-t border-gray-100 p-4 space-y-3">
          {post.comments.map((comment, commentIndex) => (
            <div
              key={commentIndex}
              className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-start space-x-2 mb-1">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <FaUserCircle className="w-full h-full text-gray-300" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-sm font-medium text-gray-800">
                      @{comment.username}
                    </p>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-6 mt-2 space-y-2">
                      {comment.replies.map((reply, replyIndex) => (
                        <div
                          key={replyIndex}
                          className="flex items-start space-x-2"
                        >
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            <FaUserCircle className="w-full h-full text-gray-300" />
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2 flex-1">
                            <p className="text-xs font-medium text-gray-800">
                              @{reply.username}
                            </p>
                            <p className="text-xs text-gray-700">
                              {reply.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply form */}
                  <div className="flex items-center mt-2">
                    <input
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 border border-gray-200 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleReplyComment(commentIndex)}
                      className="ml-2 text-blue-600 text-sm font-medium"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Comment form */}
          <div className="flex items-center space-x-2 pt-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              {currentUser?.profilePicture ? (
                <img
                  src={
                    currentUser.profilePicture?.startsWith("/")
                      ? `${import.meta.env.VITE_API_URL}${currentUser.profilePicture}`
                      : "https://img.freepik.com/free-vector/hand-drawn-side-profile-cartoon-illustration_23-2150517171.jpg?t=st=1741690774~exp=1741694374~hmac=5ddd578f5fb77fc50f0c82a4180ee1ec4004b3459c6d620b014f91aa75a60a61&w=900"
                  }
                  alt="profile picture"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-full h-full text-gray-300" />
              )}
            </div>
            <div className="flex-1 flex items-center">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border border-gray-200 rounded-full px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleAddComment}
                className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
