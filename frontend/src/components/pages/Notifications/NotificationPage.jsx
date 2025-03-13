import React, { useEffect } from "react";
import { useNotifications } from "@components/contexts/NotificationContext";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const NotificationPage = () => {
  const { notifications, markAsRead } = useNotifications();

  useEffect(() => {
    markAsRead();
  }, []);

  const getNotificationContent = (notification) => {
    switch (notification.type) {
      case "bookmark":
        return (
          <>
            <strong>{notification.userDisplayName}</strong> bookmarked your post: 
            <span className="italic ml-1">"{notification.postContent}"</span>
          </>
        );
      default:
        return notification.message;
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications for the moment.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification, index) => (
            <li key={index} className="p-4 bg-white rounded shadow hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="mb-1">{getNotificationContent(notification)}</p>
                  {notification.postId && (
                    <Link 
                      to={`/post/${notification.postId}`} 
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Voir le post
                    </Link>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {getTimeAgo(notification.timestamp)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;