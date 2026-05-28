import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function CreateResource() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'books',
    community: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resource = await api.createResource(form);
      navigate(`/resources/${resource._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Share a Resource</h1>
      <p className="page-sub">Help your community by offering something you can share</p>
      <form className="form-card" onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}
        <label>
          Title
          <input type="text" value={form.title} onChange={update('title')} required />
        </label>
        <label>
          Description
          <textarea value={form.description} onChange={update('description')} required rows={5} />
        </label>
        <label>
          Category
          <select value={form.category} onChange={update('category')}>
            <option value="books">Books</option>
            <option value="tools">Tools</option>
            <option value="skills">Skills</option>
            <option value="space">Space</option>
            <option value="equipment">Equipment</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Community
          <input type="text" value={form.community} onChange={update('community')} placeholder="General" />
        </label>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Resource'}
        </button>
      </form>
    </div>
  );
}
