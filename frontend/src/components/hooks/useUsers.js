import { useState } from "react";
import authService from "@components/services/authService.js";

export const useUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const api = authService.api;

  /**
   * Update user profile data
   * @param {FormData} formData - The form data containing user profile information
   * @returns {Promise<Object>} The updated user object
   */
  const updateProfile = async (formData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.put(`/user/me`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.user) {
        authService.updateUserInCookies(response.data.user);
      }

      setSuccess("Profile updated successfully");
      return response.data.user;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "An error occurred during profile update";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  /**
   * Update user password
   * @param {Object} passwordData - Object containing current, new and confirmation passwords
   */
  const updatePassword = async (passwordData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.put(`/user/me/password`, passwordData);
      setSuccess("Password successfully updated");
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "An error occurred during password update";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete user account
   */
  const deleteAccount = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await api.delete(`/user/me`);
      authService.logout();
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "An error occurred during account deletion";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    updatePassword,
    deleteAccount,
    isLoading,
    error,
    success,
    setError,
    setSuccess,
  };
};
