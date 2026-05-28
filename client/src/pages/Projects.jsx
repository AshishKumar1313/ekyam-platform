import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['', 'planning', 'active', 'completed'];

export default function Projects() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const communityFilter = searchParams.get('community') || '';
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (status) params.status = status;
    if (communityFilter) params.community = communityFilter;
    api
      .getProjects(params)
      .then(setProjects)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [status, communityFilter]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="section-eyebrow">Collaborate</p>
          <h1>Community Projects</h1>
          <p>
            {communityFilter
              ? `Projects in ${communityFilter}`
              : 'Collaborate on initiatives that bring people together'}
          </p>
        </div>
        {user && (
          <Link to="/projects/new" className="btn btn-primary">
            + Start Project
          </Link>
        )}
      </div>

      <div className="filters">
        {STATUSES.map((s) => (
          <button
            key={s || 'all'}
            type="button"
            className={`filter-chip ${status === s ? 'active' : ''}`}
            onClick={() => setStatus(s)}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <p className="page-loading">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="empty-state">No projects yet. Start the first one!</p>
      ) : (
        <div className="card-grid">
          {projects.map((p) => (
            <Link key={p._id} to={`/projects/${p._id}`} className="card">
              <span className={`badge badge-${p.status}`}>{p.status}</span>
              <h3>{p.title}</h3>
              <p>{p.description.slice(0, 100)}...</p>
              <div className="card-meta">
                <span>{p.community}</span>
                <span>
                  {p.members?.length || 0}/{p.maxMembers} members
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
