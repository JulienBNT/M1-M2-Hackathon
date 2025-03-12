import { useState } from "react";
import {
  FaCamera,
  FaUserCircle,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useAuth } from "@components/contexts/AuthContext.jsx";
import { useUsers } from "@components/hooks/useUsers.js";

const ProfileSettings = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const {
    updateProfile,
    updatePassword,
    deleteAccount,
    isLoading,
    error,
    success,
    setError,
    setSuccess,
  } = useUsers();

  const [formData, setFormData] = useState({
    lastname: currentUser?.lastname || "",
    firstname: currentUser?.firstname || "",
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    bio: currentUser?.bio || "",
    profilePicture:
      currentUser?.profilePicture ||
      "https://img.freepik.com/free-vector/hand-drawn-side-profile-cartoon-illustration_23-2150517171.jpg?t=st=1741690774~exp=1741694374~hmac=5ddd578f5fb77fc50f0c82a4180ee1ec4004b3459c6d620b014f91aa75a60a61&w=900",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 2 MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("lastname", formData.lastname);
      formDataToSend.append("firstname", formData.firstname);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("bio", formData.bio);

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fileInput.files[0]) {
        formDataToSend.append("profilePicture", fileInput.files[0]);
      }

      const updatedUser = await updateProfile(formDataToSend);
      setCurrentUser(updatedUser);
      setFormData((prev) => ({ ...prev, ...updatedUser }));
      setSuccess("Profil mis à jour avec succès");
      setPreviewImage(null);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil :", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("Passwords do not match");
        setIsSaving(false);
        return;
      }

      await updatePassword(passwordData);
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccess("Password updated successfully");
    } catch (err) {
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
      )
    ) {
      try {
        const success = await deleteAccount();
        if (success) {
          window.location.href = "/login";
        }
      } catch (err) {
        console.log(error);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Profile Settings
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Profile Picture
          </label>
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 flex items-center justify-center">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : currentUser?.profilePicture ? (
                <img
                  src={
                    currentUser.profilePicture.startsWith("/")
                      ? `${import.meta.env.VITE_API_URL}${currentUser.profilePicture}`
                      : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fno-picture-profile&psig=AOvVaw2-Wr3YfhEpJasWlYdA0KWC&ust=1741880997904000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPjv9MXyhIwDFQAAAAAdAAAAABAE"
                  }
                  alt="Profile Picture"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-full h-full text-gray-300" />
              )}
            </div>
            <div className="flex-1">
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <FaCamera className="h-5 w-5 mr-2 text-gray-500" />
                Upload a new image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG or GIF. 2 MB maximum.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Personal Information
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lastname
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Firstname
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  @
                </span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                Short description about you
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mb-8">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => window.location.reload()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 ${
              isSaving ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save modifications"}
          </button>
        </div>
      </form>

      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <div className="flex items-center mb-4">
          <FaShieldAlt className="text-blue-500 w-5 h-5 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">Security</h3>
        </div>

        <p className="text-gray-600 mb-4">
          Update your password regularly to keep your account secure.
        </p>

        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          onClick={() => setShowPasswordModal(true)}
        >
          Change your password
        </button>
      </div>

      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <div className="flex items-center mb-4">
          <FaExclamationTriangle className="text-red-500 w-5 h-5 mr-2" />
          <h3 className="text-lg font-medium text-red-700">Danger Zone</h3>
        </div>

        <p className="text-gray-700 mb-4">
          When you delete your account, all your data will be permanently
          removed from our servers. Please be certain.
        </p>

        <button
          type="button"
          className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </button>
      </div>

      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="password-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Password Change
              </h3>
              <form className="mt-4" onSubmit={handlePasswordSubmit}>
                <div className="mt-2 text-left">
                  <div className="mb-4">
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Current password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength="8"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Minimum characters: 8
                    </p>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm new password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>
                </div>
                <div className="items-center mt-5 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70"
                    disabled={isSaving}
                  >
                    {isSaving ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
