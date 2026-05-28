import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ResourceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [resource, setResource] = useState(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getResource(id)
      .then(setResource)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRequest = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    try {
      await api.requestResource(id, { message });
      setStatus('Request sent! Check your dashboard for updates.');
      setMessage('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="page-loading">Loading...</p>;
  if (!resource) return <p className="alert alert-error">{error || 'Not found'}</p>;

  const isOwner = user?._id === resource.owner?._id;

  return (
    <div className="page detail-page">
      <Link to="/resources" className="back-link">← Back to resources</Link>
      <div className="detail-header">
        <span className={`badge badge-${resource.availability}`}>{resource.availability}</span>
        <span className="card-category">{resource.category}</span>
        <h1>{resource.title}</h1>
        <p className="detail-community">{resource.community}</p>
      </div>
      <p className="detail-body">{resource.description}</p>
      <div className="detail-owner">
        <h3>Offered by</h3>
        <p>
          <strong>{resource.owner?.name}</strong>
          {resource.owner?.community && ` · ${resource.owner.community}`}
        </p>
        {resource.owner?.bio && <p className="muted">{resource.owner.bio}</p>}
      </div>

      {user && !isOwner && resource.availability === 'available' && (
        <form className="request-form" onSubmit={handleRequest}>
          <h3>Request this resource</h3>
          {error && <div className="alert alert-error">{error}</div>}
          {status && <div className="alert alert-success">{status}</div>}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Introduce yourself and explain how you'll use it..."
            rows={4}
          />
          <button type="submit" className="btn btn-primary">
            Send Request
          </button>
        </form>
      )}
    </div>
  );
}
