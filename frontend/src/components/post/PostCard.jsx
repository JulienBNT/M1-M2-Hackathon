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
  FaReply,
  FaLongArrowAltRight,
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
  getPostComments,
  addComment as addPostComment,
  replyToComment as replyToPostComment,
  getCommentCount,
} from "@/components/hooks/usePosts";

const PostCard = ({ post, showCommentsState, onToggleComments }) => {
  const { currentUser } = useAuth();
  const [commentText, setCommentText] = useState("");

  // Use an object to track reply text for each comment separately
  const [replyTexts, setReplyTexts] = useState({});

  // Track which comment we're replying to
  const [activeReplyId, setActiveReplyId] = useState(null);

  // Bookmark states
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isBookmarking, setIsBookmarking] = useState(false);

  // Like states
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [isLiking, setIsLiking] = useState(false);

  // Comment states
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [totalCommentsCount, setTotalCommentsCount] = useState(0);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [replyingToComment, setReplyingToComment] = useState(null);

  useEffect(() => {
    if (post && post._id) {
      // Bookmark checks
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

      // Like checks
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

      // Comment count
      const fetchCommentCount = async () => {
        try {
          const count = await getCommentCount(post._id);
          setCommentCount(count);
        } catch (error) {
          console.error("Error fetching comment count:", error);
        }
      };

      checkBookmark();
      fetchBookmarkCount();
      checkLike();
      fetchLikeCount();
      fetchCommentCount();
    }
  }, [post]);

  useEffect(() => {
    if (showCommentsState && post && post._id) {
      fetchComments();
    }
  }, [showCommentsState, post]);

  useEffect(() => {
    let total = comments.length;

    comments.forEach((comment) => {
      if (comment.replies && Array.isArray(comment.replies)) {
        total += comment.replies.length;
      }
    });

    setTotalCommentsCount(total);
  }, [comments]);

  const fetchComments = async () => {
    if (!post._id) return;

    setIsLoadingComments(true);
    try {
      const fetchedComments = await getPostComments(post._id);

      const newReplyTexts = {};
      fetchedComments.forEach((comment) => {
        newReplyTexts[comment._id] = "";
      });
      setReplyTexts(newReplyTexts);

      const commentsWithReplies = fetchedComments.reduce((grouped, comment) => {
        const isReply = comment.content.match(/^@(\w+)/);

        if (isReply) {
          const parentComment = grouped.find(
            (c) =>
              c.author?.username === isReply[1] ||
              `${c.author?.firstname} ${c.author?.lastname}` === isReply[1],
          );

          if (parentComment) {
            if (!parentComment.replies) {
              parentComment.replies = [];
            }
            parentComment.replies.push(comment);
            return grouped;
          }
        }

        comment.replies = comment.replies || [];
        grouped.push(comment);
        return grouped;
      }, []);

      setComments(commentsWithReplies);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || isAddingComment) return;

    setIsAddingComment(true);
    try {
      await addPostComment(post._id, commentText);

      await fetchComments();

      setCommentCount((prev) => prev + 1);

      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleReplyTextChange = (commentId, text) => {
    setReplyTexts((prev) => ({
      ...prev,
      [commentId]: text,
    }));
  };

  const startReply = (commentId, username) => {
    setActiveReplyId(commentId);
    // Pre-fill with @username
    setReplyTexts((prev) => ({
      ...prev,
      [commentId]: `@${username} `,
    }));
  };

  const cancelReply = () => {
    if (activeReplyId) {
      setReplyTexts((prev) => ({
        ...prev,
        [activeReplyId]: "",
      }));
      setActiveReplyId(null);
    }
  };

  const handleReplyComment = async (commentId) => {
    const replyText = replyTexts[commentId];
    if (!replyText.trim() || replyingToComment === commentId) return;

    setReplyingToComment(commentId);
    try {
      await replyToPostComment(post._id, commentId, replyText);

      await fetchComments();

      setReplyTexts((prev) => ({
        ...prev,
        [commentId]: "",
      }));

      setActiveReplyId(null);
    } catch (error) {
      console.error("Error replying to comment:", error);
    } finally {
      setReplyingToComment(null);
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

  const renderComment = (comment, isReply = false) => {
    return (
      <div
        key={comment._id}
        className={`${
          isReply
            ? "mt-3"
            : "pt-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
        }`}
      >
        <div className="flex items-start space-x-2 mb-1">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            {comment.author?.profilePicture ? (
              <img
                src={
                  comment.author.profilePicture.startsWith("/")
                    ? `${import.meta.env.VITE_API_URL}${comment.author.profilePicture}`
                    : "https://img.freepik.com/free-vector/hand-drawn-side-profile-cartoon-illustration_23-2150517171.jpg?t=st=1741690774~exp=1741694374~hmac=5ddd578f5fb77fc50f0c82a4180ee1ec4004b3459c6d620b014f91aa75a60a61&w=900"
                }
                alt="profile picture"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUserCircle className="w-full h-full text-gray-300" />
            )}
          </div>
          <div className="flex-1">
            <div
              className={`rounded-lg p-2.5 ${
                isReply ? "bg-gray-50 border border-gray-200" : "bg-gray-50"
              }`}
            >
              <div className="flex gap-2 items-center">
                <p className="text-sm font-medium text-gray-800">
                  {comment.author?.firstname} {comment.author?.lastname}
                </p>
                <p className="text-xs text-gray-500">
                  @{comment.author?.username}
                </p>
              </div>
              <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
              {comment.createdAt && (
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(comment.createdAt)}
                </p>
              )}
            </div>

            {/* Reply button */}
            {!isReply && (
              <button
                onClick={() =>
                  startReply(comment._id, comment.author?.username)
                }
                className="text-xs text-blue-800 mt-1.5 flex items-center"
              >
                <FaReply className="mr-1" /> Reply
              </button>
            )}

            {/* Reply form - only show if actively replying to this comment */}
            {activeReplyId === comment._id && (
              <div className="flex items-center mt-2 bg-blue-50 p-2 rounded-lg">
                <input
                  value={replyTexts[comment._id] || ""}
                  onChange={(e) =>
                    handleReplyTextChange(comment._id, e.target.value)
                  }
                  placeholder="Write a reply..."
                  className="flex-1 border border-gray-200 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-800"
                  autoFocus
                />
                <button
                  onClick={() => handleReplyComment(comment._id)}
                  disabled={replyingToComment === comment._id}
                  className={`ml-2 text-blue-800 text-sm font-medium ${
                    replyingToComment === comment._id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {replyingToComment === comment._id ? "Replying..." : "Reply"}
                </button>
                <button
                  onClick={cancelReply}
                  className="ml-2 text-gray-500 text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Render replies to this comment */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-10 mt-3 pl-4 border-l-2 border-blue-100 space-y-3">
            {/* Reply indicator with count */}
            <div className="flex items-center text-xs text-gray-500 -ml-8 -mt-1 mb-1">
              <FaLongArrowAltRight className="text-blue-300 mr-1" />
              Replies ({comment.replies.length})
            </div>

            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
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
              isLiked ? "text-blue-800" : "text-gray-600 hover:text-blue-900"
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
            <span>{commentCount}</span>
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
        <div className="border-t border-gray-100 p-4 space-y-0">
          {/* Comment form - moved to top for easier access */}
          <div className="flex items-center space-x-2 pb-4 border-b border-gray-100 mb-2">
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
                className="flex-1 border border-gray-200 rounded-full px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-800"
              />
              <button
                onClick={handleAddComment}
                disabled={isAddingComment}
                className={`ml-2 px-3 py-1 bg-blue-800 text-white rounded-full text-sm hover:bg-blue-900 ${
                  isAddingComment ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isAddingComment ? "Posting..." : "Post"}
              </button>
            </div>
          </div>

          {/* Comments section */}
          <div>
            {isLoadingComments ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-800"></div>
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-0">
                <h3 className="font-medium text-gray-700 mb-2">
                  Comments ({totalCommentsCount})
                </h3>
                {comments.map((comment) => renderComment(comment))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
