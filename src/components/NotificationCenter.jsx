import { useCallback, useEffect, useState } from "react";
import "../css/NotificationCenter.css";

function NotificationCenter({ onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/notifications", {
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load notifications");
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount ?? (data.notifications || []).filter((item) => !item.read).length);
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Unable to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshNotifications();
    const intervalId = window.setInterval(refreshNotifications, 30000);
    window.addEventListener("focus", refreshNotifications);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshNotifications);
    };
  }, [refreshNotifications]);

  const markAsRead = async (notification) => {
    if (notification.read) return;
    setNotifications((current) => current.map((item) => item._id === notification._id ? { ...item, read: true } : item));
    setUnreadCount((current) => Math.max(0, current - 1));
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${notification._id}/read`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to mark notification as read");
      if (typeof data.unreadCount === "number") setUnreadCount(data.unreadCount);
    } catch (requestError) {
      setNotifications((current) => current.map((item) => item._id === notification._id ? { ...item, read: false } : item));
      setUnreadCount((current) => current + 1);
      setError(requestError.message || "Unable to update notification");
    }
  };

  const markAllAsRead = async () => {
    const previous = notifications;
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);
    try {
      const response = await fetch("http://localhost:5000/api/notifications/read-all", {
        method: "PUT",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to mark notifications as read");
      setUnreadCount(data.unreadCount ?? 0);
    } catch (requestError) {
      setNotifications(previous);
      setUnreadCount(previous.filter((item) => !item.read).length);
      setError(requestError.message || "Unable to update notifications");
    }
  };

  const openNotification = async (notification) => {
    await markAsRead(notification);
    if (notification.target) onNavigate?.(notification.target, notification);
  };

  return (
    <div className="notification-center">
      <button
        type="button"
        className={`notification-toggle ${open ? "active" : ""}`}
        aria-expanded={open}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        onClick={() => { setOpen((current) => !current); setError(""); }}
      >
        <span className="notification-bell" aria-hidden="true">🔔</span>
        <span className="notification-toggle-label">Notifications</span>
        {unreadCount > 0 && <span className="notification-count">{unreadCount > 99 ? "99+" : unreadCount}</span>}
      </button>

      {open && (
        <section className="notification-panel" aria-label="Notifications panel">
          <header className="notification-panel-header">
            <div><strong>Notifications</strong><span>{unreadCount} unread</span></div>
            {unreadCount > 0 && <button type="button" onClick={markAllAsRead}>Mark all as read</button>}
          </header>
          {error && <p className="notification-error" role="alert">{error}</p>}
          {loading && notifications.length === 0 ? <p className="notification-empty">Loading notifications…</p>
            : notifications.length === 0 ? <p className="notification-empty">You’re all caught up. No notifications yet.</p>
            : <ul className="notification-list">{notifications.map((notification) => (
              <li key={notification._id} className={notification.read ? "read" : "unread"}>
                <button type="button" className="notification-item" onClick={() => openNotification(notification)}>
                  <span className="notification-read-dot" aria-hidden="true" />
                  <span className="notification-item-copy">
                    <span>{notification.message}</span>
                    <time dateTime={notification.createdAt}>{new Date(notification.createdAt).toLocaleString("en-IN")}</time>
                    <small>{notification.read ? "Read" : "Unread"}</small>
                  </span>
                </button>
                {!notification.read && <button type="button" className="notification-mark-read" onClick={() => markAsRead(notification)}>Mark read</button>}
              </li>
            ))}</ul>}
        </section>
      )}
    </div>
  );
}

export default NotificationCenter;
