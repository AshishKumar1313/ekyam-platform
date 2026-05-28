import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [s, u] = await Promise.all([api.getAdminStats(), api.getAdminUsers()]);
      setStats(s);
      setUsers(u);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.deleteUser(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <p className="page-loading">Loading admin panel...</p>;

  return (
    <section className="page">
      <h1>Admin Panel</h1>
      <p className="page-sub">Platform overview and user management</p>
      {error && <p className="alert alert-error">{error}</p>}

      {stats && (
        <ul className="stats-grid">
          <li className="stat-card">
            <span className="stat-value">{stats.users}</span>
            <span className="stat-label">Users</span>
          </li>
          <li className="stat-card">
            <span className="stat-value">{stats.resources}</span>
            <span className="stat-label">Resources</span>
          </li>
          <li className="stat-card">
            <span className="stat-value">{stats.projects}</span>
            <span className="stat-label">Projects</span>
          </li>
          <li className="stat-card">
            <span className="stat-value">{stats.pendingRequests}</span>
            <span className="stat-label">Pending Requests</span>
          </li>
        </ul>
      )}

      <section className="dashboard-section">
        <h2>All Users</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Community</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.community || '—'}</td>
                <td>{u.role}</td>
                <td>
                  {u.role !== 'admin' && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => handleDelete(u._id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}
