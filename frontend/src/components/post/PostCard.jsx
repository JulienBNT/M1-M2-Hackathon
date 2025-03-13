import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaThumbsUp,
  FaComment,
  FaEllipsisH,
  FaRegThumbsUp,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { formatDate } from "@/components/utils/dateUtils";
import { useAuth } from "@/components/contexts/AuthContext";
import {
  checkBookmarkStatus,
  bookmarkPost,
  unbookmarkPost,
  getBookmarkCount,
  checkLikeStatus,
  likePost,
  unlikePost,
  getLikeCount,
} from "@/components/hooks/usePosts";

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

  // Bookmark states
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isBookmarking, setIsBookmarking] = useState(false);

  // Like states
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (post && post._id) {
      const checkBookmark = async () => {
        try {
          const status = await checkBookmarkStatus(post._id);
          setIsBookmarked(status);
        } catch (error) {
          console.error("Error checking bookmark status:", error);
        }
      };

      const fetchBookmarkCount = async () => {
        try {
          const count = await getBookmarkCount(post._id);
          setBookmarkCount(count);
        } catch (error) {
          console.error("Error fetching bookmark count:", error);
        }
      };
      const checkLike = async () => {
        try {
          const status = await checkLikeStatus(post._id);
          setIsLiked(status);
        } catch (error) {
          console.error("Error checking like status:", error);
        }
      };

      const fetchLikeCount = async () => {
        try {
          const count = await getLikeCount(post._id);
          setLikeCount(count || post.likes || 0);
        } catch (error) {
          console.error("Error fetching like count:", error);
        }
      };

      checkBookmark();
      fetchBookmarkCount();
      checkLike();
      fetchLikeCount();
    }
  }, [post]);

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

  const handleBookmarkToggle = async () => {
    if (!post._id || isBookmarking) return;

    setIsBookmarking(true);
    try {
      if (isBookmarked) {
        await unbookmarkPost(post._id);
        setIsBookmarked(false);
        setBookmarkCount((prevCount) => Math.max(0, prevCount - 1));
      } else {
        await bookmarkPost(post._id);
        setIsBookmarked(true);
        setBookmarkCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!post._id || isLiking) return;

    setIsLiking(true);
    try {
      if (isLiked) {
        await unlikePost(post._id);
        setIsLiked(false);
        setLikeCount((prevCount) => Math.max(0, prevCount - 1));
      } else {
        await likePost(post._id);
        setIsLiked(true);
        setLikeCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 overflow-hidden">
      {post && (
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
              {post.author?.profilePicture ? (
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
                to={`/profile/${post.author?.username}`}
                className="font-semibold text-gray-800 hover:underline"
              >
                {post.author?.name}
              </Link>
              <div className="flex gap-2 items-center">
                <p className="text-md text-black-600 font-bold">
                  {post.author?.firstname} {post.author?.lastname}
                </p>
                <p className="text-sm text-gray-500">
                  @{post.author?.username}
                </p>
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
              <span key={idx} className="text-blue-800 text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between border-t border-gray-100 px-4 py-3">
        <div className="flex">
          <button
            onClick={handleLikeToggle}
            disabled={isLiking}
            className={`flex items-center space-x-1 ${
              isLiked ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
            } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLiked ? (
              <FaThumbsUp className="w-5 h-5" />
            ) : (
              <FaRegThumbsUp className="w-5 h-5" />
            )}
            <span>{likeCount}</span>
          </button>
          <button
            onClick={onToggleComments}
            className="flex items-center space-x-2 ml-4 text-gray-600 hover:text-blue-900"
          >
            <FaRegComment className="w-5 h-5" />
          </button>
        </div>
        <div className="flex">
          <button
            onClick={handleBookmarkToggle}
            disabled={isBookmarking}
            className={`flex items-center space-x-1 ${
              isBookmarked
                ? "text-orange-400"
                : "text-gray-600 hover:text-orange-500"
            } ${isBookmarking ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isBookmarked ? (
              <FaBookmark className="w-5 h-5" />
            ) : (
              <FaRegBookmark className="w-5 h-5" />
            )}
            {bookmarkCount > 0 && <span>{bookmarkCount}</span>}
          </button>
        </div>
      </div>

      {showCommentsState && (
        <div className="border-t border-gray-100 p-4 space-y-3">
          {post.comments?.map((comment, commentIndex) => (
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
