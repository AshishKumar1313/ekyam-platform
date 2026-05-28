import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function Communities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getCommunities()
      .then(setCommunities)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="section-eyebrow">Network</p>
          <h1>Communities</h1>
          <p className="page-sub">
            Discover groups sharing resources and running projects on EKYAM
          </p>
        </div>
        <Link to="/register" className="btn btn-primary">
          Start Your Community
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <p className="page-loading">Loading communities...</p>
      ) : communities.length === 0 ? (
        <div className="empty-state-card">
          <p>No communities yet. Register and set your community name to appear here.</p>
          <Link to="/register" className="btn btn-primary">
            Join EKYAM
          </Link>
        </div>
      ) : (
        <div className="communities-grid">
          {communities.map((c) => (
            <article key={c.name} className="community-card">
              <div className="community-avatar">{c.name.charAt(0).toUpperCase()}</div>
              <h3>{c.name}</h3>
              <ul className="community-stats">
                <li>
                  <strong>{c.members}</strong> members
                </li>
                <li>
                  <strong>{c.resources}</strong> resources
                </li>
                <li>
                  <strong>{c.projects}</strong> projects
                </li>
              </ul>
              <Link to={`/projects?community=${encodeURIComponent(c.name)}`} className="btn btn-outline btn-sm">
                View projects
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
