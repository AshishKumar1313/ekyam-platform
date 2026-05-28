import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProject(id)
      .then(setProject)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    try {
      await api.joinProject(id, { message });
      setStatus('Join request sent! The organizer will review it.');
      setMessage('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="page-loading">Loading...</p>;
  if (!project) return <p className="alert alert-error">{error || 'Not found'}</p>;

  const isMember = project.members?.some((m) => m._id === user?._id);
  const isOrganizer = project.organizer?._id === user?._id;

  return (
    <section className="page detail-page">
      <Link to="/projects" className="back-link">← Back to projects</Link>
      <header className="detail-header">
        <span className={`badge badge-${project.status}`}>{project.status}</span>
        <h1>{project.title}</h1>
        <p className="detail-community">{project.community}</p>
      </header>
      <p className="detail-body">{project.description}</p>
      <article className="detail-goal">
        <h3>Project Goal</h3>
        <p>{project.goal}</p>
      </article>
      <section className="detail-members">
        <h3>
          Members ({project.members?.length || 0}/{project.maxMembers})
        </h3>
        <ul>
          {project.members?.map((m) => (
            <li key={m._id}>{m.name}</li>
          ))}
        </ul>
      </section>

      {user && !isMember && !isOrganizer && project.status !== 'completed' && (
        <form className="request-form" onSubmit={handleJoin}>
          <h3>Request to join</h3>
          {error && <p className="alert alert-error">{error}</p>}
          {status && <p className="alert alert-success">{status}</p>}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Why do you want to join this project?"
            rows={4}
          />
          <button type="submit" className="btn btn-primary">
            Request to Join
          </button>
        </form>
      )}
    </section>
  );
}
