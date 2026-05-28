import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [serverOk, setServerOk] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    community: '',
    bio: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  useEffect(() => {
    fetch('/api/health')
      .then((r) => setServerOk(r.ok))
      .catch(() => setServerOk(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(form);
      if (data.needsVerification) {
        navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Join EKYAM</h1>
        <p className="auth-sub">Be part of a community that shares and collaborates</p>
        {serverOk === false && (
          <div className="alert alert-error">
            Backend is offline. In another terminal run: <code>cd server</code> then{' '}
            <code>npm run dev</code>
          </div>
        )}
        {error && <div className="alert alert-error">{error}</div>}
        <label>
          Full Name
          <input type="text" value={form.name} onChange={update('name')} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={update('email')} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={update('password')}
            required
            minLength={6}
          />
        </label>
        <label>
          Community / Neighborhood
          <input
            type="text"
            value={form.community}
            onChange={update('community')}
            placeholder="e.g. Green Valley, Cultural Society"
          />
        </label>
        <label>
          Short Bio
          <textarea value={form.bio} onChange={update('bio')} rows={3} placeholder="Tell us about yourself" />
        </label>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
