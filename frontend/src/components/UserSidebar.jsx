import { getAvatarColor, getInitials } from "../utils/helpers";

export default function UserSidebar({ users, currentUser }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Online</span>
        <span className="user-count">{users.length}</span>
      </div>

      <ul className="user-list">
        {users.map((user, i) => (
          <li key={i} className="user-item">
            <div className="avatar" style={{ background: getAvatarColor(user.username) }}>
              {getInitials(user.username)}
            </div>
            <span className="username">
              {user.username}
              {user.username === currentUser && <span className="you-badge"> (you)</span>}
            </span>
            <span className="online-dot" />
          </li>
        ))}
      </ul>
    </aside>
  );
}
