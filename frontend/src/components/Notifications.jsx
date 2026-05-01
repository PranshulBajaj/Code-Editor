export default function Notifications({ notifications }) {
  if (!notifications.length) return null;

  return (
    <div className="notif-stack">
      {notifications.map((n) => (
        <div key={n.id} className="notif">
          <span className={`notif-dot ${n.type === "leave" ? "leave" : ""}`} />
          {n.message}
        </div>
      ))}
    </div>
  );
}
