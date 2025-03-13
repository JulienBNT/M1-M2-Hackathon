import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Image as ImageIcon } from "lucide-react";
import {
  FaUserCircle,
  FaThumbsUp,
  FaComment,
  FaEllipsisH,
} from "react-icons/fa";
import { useAuth } from "@/components/contexts/AuthContext";
import { formatDate } from "@/components/utils/dateUtils";

function Home() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [showComments, setShowComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const { currentUser } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleTweetPost = () => {
    if (text || image) {
      const newPost = {
        author: currentUser,
        text,
        image,
        likes: 0,
        comments: [],
        createdAt: new Date(),
      };
      setPosts([newPost, ...posts]);
      setText("");
      setImage(null);
    }
  };

  const handleLikePost = (postIndex) => {
    const updatedPosts = [...posts];
    updatedPosts[postIndex].likes += 1;
    setPosts(updatedPosts);
  };

  const handleAddComment = (postIndex) => {
    const updatedPosts = [...posts];
    if (commentText) {
      updatedPosts[postIndex].comments.push({
        username: currentUser.username,
        text: commentText,
        likes: 0,
        replies: [],
      });
      setPosts(updatedPosts);
      setCommentText("");
    }
  };
  const handleReplyComment = (postIndex, commentIndex) => {
    const updatedPosts = [...postbs];
    if (replyText) {
      updatedPosts[postIndex].comments[commentIndex].replies.push({
        username: currentUser.username,
        text: replyText,
        likes: 0,
      });
      setPosts(updatedPosts);
      setReplyText("");
    }
  };

  const toggleComments = (postIndex) => {
    const updatedShowComments = [...showComments];
    updatedShowComments[postIndex] = !updatedShowComments[postIndex];
    setShowComments(updatedShowComments);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 w-full max-w-2xl">
      <aside className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 w-full">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
            {currentUser.profilePicture ? (
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
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's happening?"
            className="w-full border-b border-gray-300 text-lg p-2 outline-none resize-none"
            rows={2}
          />
        </div>
        {image && (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img
              src={image}
              alt="Preview"
              className="w-full max-w-xs object-cover rounded-md"
            />
          </div>
        )}
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-1 text-blue-800 cursor-pointer">
            <ImageIcon className="w-5 h-5" />
            <span>Add image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          <button
            onClick={handleTweetPost}
            className="px-3 py-1 rounded-md bg-blue-800 text-white hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      </aside>

      <div className="w-full space-y-4">
        {posts.map((post, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  {post.author.profilePicture ? (
                    <img
                      src={
                        post.author?.profilePicture?.startsWith("/")
                          ? `${import.meta.env.VITE_API_URL}${post?.author.profilePicture}`
                          : post?.author.profilePicture
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
                    <p className="text-sm text-gray-500">
                      @{post.author.username}
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
            <div className="p-4">
              <p className="text-gray-800 mb-4">{post.text}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full rounded-lg object-cover"
                />
              )}
            </div>
            <div className="flex border-t border-gray-100 px-4 py-3">
              <button
                onClick={() => handleLikePost(index)}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
              >
                <FaThumbsUp className="w-5 h-5" />
                <span>{post.likes}</span>
                <span>Like</span>
              </button>
              <button
                onClick={() => toggleComments(index)}
                className="flex items-center space-x-2 ml-4 text-gray-600 hover:text-blue-600"
              >
                <FaComment className="w-5 h-5" />
                <span>Comment</span>
              </button>
            </div>
            {showComments[index] && (
              <div className="mt-2 space-y-2">
                {post.comments.map((comment, commentIndex) => (
                  <div key={commentIndex} className="pl-4">
                    <p className="text-gray-700">
                      {comment.username}: {comment.text}
                    </p>
                    {comment.replies.map((reply, replyIndex) => (
                      <div key={replyIndex} className="pl-4">
                        <p className="text-gray-600">
                          {reply.username}: {reply.text}
                        </p>
                      </div>
                    ))}
                    <input
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full border rounded-md p-1 mt-1"
                    />
                    <button
                      onClick={() => handleReplyComment(index, commentIndex)}
                      className="text-blue-600 mt-1"
                    >
                      Reply
                    </button>
                  </div>
                ))}
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full border rounded-md p-1 mt-2"
                />
                <button
                  onClick={() => handleAddComment(index)}
                  className="text-blue-600 mt-1"
                >
                  Add Comment
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
