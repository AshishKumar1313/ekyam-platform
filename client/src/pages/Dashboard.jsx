import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .getCollaborations()
      .then(setCollaborations)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatus = async (id, status) => {
    try {
      await api.updateCollaboration(id, { status });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const incoming = collaborations.filter(
    (c) => c.owner?._id === user?._id && c.status === 'pending'
  );
  const outgoing = collaborations.filter((c) => c.requester?._id === user?._id);
  const history = collaborations.filter((c) => c.status !== 'pending');

  return (
    <section className="page">
      <h1>My Dashboard</h1>
      <p className="page-sub">
        Welcome, {user?.name}! Manage your collaborations and community activity.
      </p>

      <nav className="dashboard-actions">
        <Link to="/resources/new" className="btn btn-secondary">
          Share Resource
        </Link>
        <Link to="/projects/new" className="btn btn-secondary">
          Start Project
        </Link>
      </nav>

      {error && <p className="alert alert-error">{error}</p>}
      {loading ? (
        <p className="page-loading">Loading...</p>
      ) : (
        <>
          <section className="dashboard-section">
            <h2>Incoming Requests ({incoming.length})</h2>
            {incoming.length === 0 ? (
              <p className="muted">No pending requests</p>
            ) : (
              <ul className="collab-list">
                {incoming.map((c) => (
                  <li key={c._id} className="collab-item">
                    <p>
                      <strong>{c.requester?.name}</strong> wants to{' '}
                      {c.type === 'resource' ? 'use' : 'join'}{' '}
                      <strong>
                        {c.resource?.title || c.project?.title}
                      </strong>
                    </p>
                    {c.message && <p className="muted">{c.message}</p>}
                    <span className="collab-actions">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleStatus(c._id, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleStatus(c._id, 'rejected')}
                      >
                        Reject
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="dashboard-section">
            <h2>My Requests</h2>
            {outgoing.length === 0 ? (
              <p className="muted">You have not sent any requests yet</p>
            ) : (
              <ul className="collab-list">
                {outgoing.map((c) => (
                  <li key={c._id} className="collab-item">
                    <p>
                      {c.type === 'resource' ? 'Resource' : 'Project'}:{' '}
                      <strong>{c.resource?.title || c.project?.title}</strong>
                    </p>
                    <span className={`badge badge-${c.status}`}>{c.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="dashboard-section">
            <h2>History</h2>
            {history.length === 0 ? (
              <p className="muted">No past collaborations</p>
            ) : (
              <ul className="collab-list">
                {history.map((c) => (
                  <li key={c._id} className="collab-item">
                    <p>
                      {c.resource?.title || c.project?.title} —{' '}
                      <span className={`badge badge-${c.status}`}>{c.status}</span>
                    </p>
                    {c.owner?._id === user?._id && c.status === 'approved' && c.type === 'resource' && (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleStatus(c._id, 'completed')}
                      >
                        Mark Returned
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </section>
  );
}
