import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function CreateProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    goal: '',
    community: '',
    maxMembers: 20,
    tags: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        maxMembers: Number(form.maxMembers),
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const project = await api.createProject(payload);
      navigate(`/projects/${project._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <h1>Start a Community Project</h1>
      <p className="page-sub">Bring people together around a shared goal</p>
      <form className="form-card" onSubmit={handleSubmit}>
        {error && <p className="alert alert-error">{error}</p>}
        <label>
          Title
          <input type="text" value={form.title} onChange={update('title')} required />
        </label>
        <label>
          Description
          <textarea value={form.description} onChange={update('description')} required rows={4} />
        </label>
        <label>
          Goal
          <textarea value={form.goal} onChange={update('goal')} required rows={3} />
        </label>
        <label>
          Community
          <input type="text" value={form.community} onChange={update('community')} placeholder="General" />
        </label>
        <label>
          Max Members
          <input type="number" min={2} value={form.maxMembers} onChange={update('maxMembers')} />
        </label>
        <label>
          Tags (comma separated)
          <input type="text" value={form.tags} onChange={update('tags')} placeholder="education, cleanup" />
        </label>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </section>
  );
}
