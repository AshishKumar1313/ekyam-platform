import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

const MARQUEE = [
  'Communities',
  'Projects',
  'Resources',
  'Collaboration',
  'Unity',
  'Open Platform',
  'Free Forever',
];

const FEATURES = [
  {
    icon: '📦',
    title: 'Resource Sharing',
    text: 'Share books, tools, skills, and equipment across neighborhoods and groups.',
  },
  {
    icon: '🚀',
    title: 'Project Collaboration',
    text: 'Launch community initiatives and manage members with approval workflows.',
  },
  {
    icon: '🤝',
    title: 'Smart Requests',
    text: 'Request resources or join projects — owners approve from their dashboard.',
  },
  {
    icon: '🌏',
    title: 'Community Hubs',
    text: 'Discover active communities and see resources and projects in one place.',
  },
  {
    icon: '🔐',
    title: 'Secure Auth',
    text: 'JWT sessions, bcrypt passwords, and optional email OTP verification.',
  },
  {
    icon: '✨',
    title: 'Admin Control',
    text: 'Platform statistics and user management for administrators.',
  },
];

const STEPS = [
  { n: '1', title: 'Create Account', text: 'Register in seconds and join your community.' },
  { n: '2', title: 'Discover & Share', text: 'Browse resources, projects, and local communities.' },
  { n: '3', title: 'Collaborate', text: 'Request, approve, and grow impact together.' },
];

const TESTIMONIALS = [
  {
    quote:
      'EKYAM helped our college clubs share textbooks and organize cultural events in one place.',
    name: 'Priya Sharma',
    role: 'Student Union Lead',
    initial: 'P',
  },
  {
    quote:
      'The resource request flow is simple — we saved hours coordinating donations across NGOs.',
    name: 'Arjun Mehta',
    role: 'NGO Coordinator',
    initial: 'A',
  },
  {
    quote:
      'Projects and collaborations made it easy to unite different communities around one goal.',
    name: 'Riya Patel',
    role: 'Community Organizer',
    initial: 'R',
  },
];

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, resources: 0, projects: 0, communities: 0 });
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.getPublicStats().then(setStats).catch(() => {});
    api.getFeaturedProjects().then(setFeatured).catch(() => {});
  }, []);

  const display = (n) => (n > 0 ? `${n}+` : '0');

  return (
    <div className="home">
      <section className="hero-pro">
        <div className="hero-glow" aria-hidden />
        <div className="hero-pro-inner">
          <span className="live-badge">
            <span className="live-dot" /> LIVE · Community Platform
          </span>
          <h1 className="hero-title">
            Unite. <span className="gradient-text">Collaborate.</span>
            <br />
            Make a Lasting Impact.
          </h1>
          <p className="hero-lead">
            EKYAM brings diverse communities together through shared resources, collaborative
            projects, and meaningful connections.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
            )}
            <Link to="/communities" className="btn btn-glass btn-lg">
              Explore Communities
            </Link>
          </div>
        </div>
      </section>

      <div className="marquee-wrap" aria-hidden>
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={`${item}-${i}`}>{item}</span>
          ))}
        </div>
      </div>

      <section className="stats-bar">
        <div className="stats-grid-pro">
          <div className="stat-pro">
            <span className="stat-pro-num">{display(stats.communities)}</span>
            <span className="stat-pro-label">Communities</span>
          </div>
          <div className="stat-pro">
            <span className="stat-pro-num">{display(stats.projects)}</span>
            <span className="stat-pro-label">Projects</span>
          </div>
          <div className="stat-pro">
            <span className="stat-pro-num">{display(stats.resources)}</span>
            <span className="stat-pro-label">Resources</span>
          </div>
          <div className="stat-pro">
            <span className="stat-pro-num">{display(stats.users)}</span>
            <span className="stat-pro-label">Members</span>
          </div>
        </div>
      </section>

      <section className="section-pro">
        <p className="section-eyebrow">Platform</p>
        <h2 className="section-title">
          Everything you need,
          <br />
          <span className="muted-title">nothing you don&apos;t.</span>
        </h2>
        <div className="features-pro">
          {FEATURES.map((f) => (
            <article key={f.title} className="feature-pro">
              <span className="feature-pro-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-pro section-alt">
        <p className="section-eyebrow">Process</p>
        <h2 className="section-title">Up and running in three steps</h2>
        <div className="steps-row">
          {STEPS.map((s) => (
            <article key={s.n} className="step-card">
              <span className="step-num">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-pro">
        <p className="section-eyebrow">Testimonials</p>
        <h2 className="section-title">What people are saying</h2>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <blockquote key={t.name} className="testimonial-card">
              <p>&ldquo;{t.quote}&rdquo;</p>
              <footer>
                <span className="avatar">{t.initial}</span>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="section-pro section-alt">
        <p className="section-eyebrow">Featured</p>
        <h2 className="section-title">Projects in motion</h2>
        {featured.length === 0 ? (
          <div className="empty-featured">
            <p>Be the first to start a community project!</p>
            <Link to="/projects/new" className="btn btn-primary">
              Start a Project
            </Link>
          </div>
        ) : (
          <div className="featured-grid">
            {featured.map((p) => (
              <Link key={p._id} to={`/projects/${p._id}`} className="featured-card">
                <span className={`badge badge-${p.status}`}>{p.status}</span>
                <h3>{p.title}</h3>
                <p>{p.description.slice(0, 90)}…</p>
                <span className="featured-meta">
                  {p.community} · {p.members?.length || 0} members
                </span>
              </Link>
            ))}
          </div>
        )}
        <Link to="/projects" className="link-more">
          View all projects →
        </Link>
      </section>

      <section className="cta-pro">
        <h2>Ready to make a difference?</h2>
        <p>Join community members working together for a more connected future.</p>
        <Link to={user ? '/dashboard' : '/register'} className="btn btn-light btn-lg">
          {user ? 'Open Dashboard' : 'Join EKYAM Today'}
        </Link>
      </section>
    </div>
  );
}
