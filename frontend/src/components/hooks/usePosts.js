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

export async function likePost(postId) {
  try {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error("Error liking post:", error);
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
