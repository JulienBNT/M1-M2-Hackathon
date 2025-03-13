import authService from "@components/services/authService";

const api = authService.api;

export async function getAllUserPosts(userId) {
  const response = await api.get(`/posts/get-all-posts/${userId}`);
  return response.data;
}

export async function fetchPosts() {
  try {
    const response = await api.get(`/posts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export async function createPost(postData) {
  try {
    const postPayload = {
      content: postData.text,
      hashtags: postData.hashtags || [],
    };

    const response = await api.post(`/posts`, postPayload);
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function addComment(postId, commentText) {
  try {
    const response = await api.post(`/comments`, {
      postId,
      content: commentText,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

export async function deletePost(postId) {
  try {
    await api.delete(`/posts/${postId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

// Bookmarks
export async function bookmarkPost(postId) {
  try {
    const response = await api.post(`/bookmarks/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error bookmarking post:", error);
    throw error;
  }
}

export async function unbookmarkPost(postId) {
  try {
    const response = await api.delete(`/bookmarks/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing bookmark:", error);
    throw error;
  }
}

export async function getUserBookmarks(userId) {
  try {
    const url = userId ? `/bookmarks/${userId}` : "/bookmarks";
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching bookmarked posts:", error);
    throw error;
  }
}

export async function checkBookmarkStatus(postId) {
  try {
    const response = await api.get(`/bookmarks/${postId}/status`);
    return response.data.isBookmarked;
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return false;
  }
}

export async function getBookmarkCount(postId) {
  try {
    const response = await api.get(`/bookmarks/${postId}/count`);
    return response.data.count;
  } catch (error) {
    console.error("Error fetching bookmark count:", error);
    return 0;
  }
}

// Likes
export async function likePost(postId) {
  try {
    const response = await api.post(`/likes`, { postId });
    return response.data;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
}

export async function unlikePost(postId) {
  try {
    const response = await api.delete(`/likes`, { data: { postId } });
    return response.data;
  } catch (error) {
    console.error("Error unliking post:", error);
    throw error;
  }
}

export async function getUserLikes() {
  try {
    const response = await api.get("/likes");
    return response.data;
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    throw error;
  }
}

export async function checkLikeStatus(postId) {
  try {
    const likes = await getUserLikes();
    return likes.some((like) => like.post._id === postId);
  } catch (error) {
    console.error("Error checking like status:", error);
    return false;
  }
}

export async function getLikeCount(postId) {
  try {
    const response = await api.get(`/likes/count/${postId}`);
    return response.data.count;
  } catch (error) {
    console.error("Error fetching like count:", error);
    return 0;
  }
}
