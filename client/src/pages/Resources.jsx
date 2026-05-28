import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['', 'books', 'tools', 'skills', 'space', 'equipment', 'other'];

export default function Resources() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .getResources(category ? { category } : {})
      .then(setResources)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="section-eyebrow">Share</p>
          <h1>Shared Resources</h1>
          <p>Discover what communities are offering to each other</p>
        </div>
        {user && (
          <Link to="/resources/new" className="btn btn-primary">
            + Share Resource
          </Link>
        )}
      </div>

      <div className="filters">
        {CATEGORIES.map((c) => (
          <button
            key={c || 'all'}
            type="button"
            className={`filter-chip ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c || 'All'}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <p className="page-loading">Loading resources...</p>
      ) : resources.length === 0 ? (
        <p className="empty-state">No resources yet. Be the first to share!</p>
      ) : (
        <div className="card-grid">
          {resources.map((r) => (
            <Link key={r._id} to={`/resources/${r._id}`} className="card">
              <span className={`badge badge-${r.availability}`}>{r.availability}</span>
              <span className="card-category">{r.category}</span>
              <h3>{r.title}</h3>
              <p>{r.description.slice(0, 100)}...</p>
              <div className="card-meta">
                <span>{r.community}</span>
                <span>by {r.owner?.name}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
