import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import './ProjectsPage.css';

const COLORS = ['#6366f1','#ec4899','#14b8a6','#f59e0b','#3b82f6','#8b5cf6','#ef4444','#10b981'];

const statusBadge = { active: 'badge-in-progress', 'on-hold': 'badge-review', completed: 'badge-done', archived: 'badge-todo' };

function ProjectModal({ project, onClose, onSave }) {
  const [form, setForm] = useState({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'active',
    priority: project?.priority || 'medium',
    deadline: project?.deadline ? project.deadline.slice(0, 10) : '',
    color: project?.color || COLORS[0]
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (project) {
        const { data } = await projectAPI.update(project._id, form);
        onSave(data.project, true);
        toast.success('Project updated!');
      } else {
        const { data } = await projectAPI.create(form);
        onSave(data.project, false);
        toast.success('Project created!');
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{project ? 'Edit Project' : 'New Project'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input className="form-input" placeholder="My Awesome Project"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" placeholder="What is this project about?"
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input type="date" className="form-input"
              value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Color</label>
            <div className="color-picker">
              {COLORS.map(c => (
                <button key={c} type="button"
                  className={`color-dot ${form.color === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setForm(f => ({ ...f, color: c }))}
                />
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : project ? 'Update' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    projectAPI.getAll()
      .then(r => setProjects(r.data.projects))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (proj, isEdit) => {
    if (isEdit) setProjects(ps => ps.map(p => p._id === proj._id ? proj : p));
    else setProjects(ps => [proj, ...ps]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await projectAPI.delete(id);
      setProjects(ps => ps.filter(p => p._id !== id));
      toast.success('Project deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditProject(null); setShowModal(true); }}>
          + New Project
        </button>
      </div>

      <div className="search-bar">
        <input className="form-input" placeholder="Search projects..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="full-loader" style={{ height: 200 }}><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          <h3>No projects found</h3>
          <p>{search ? 'Try a different search term.' : 'Create your first project to get started.'}</p>
        </div>
      ) : (
        <div className="projects-grid">
          {filtered.map(p => {
            const isOwner = p.owner?._id === user?._id;
            const progress = p.taskCount > 0 ? Math.round((p.completedCount / p.taskCount) * 100) : 0;
            return (
              <div key={p._id} className="project-card">
                <div className="project-card-top" style={{ borderTopColor: p.color }}>
                  <div className="flex-between">
                    <span className={`badge ${statusBadge[p.status]}`}>{p.status}</span>
                    <span className={`badge badge-${p.priority}`}>{p.priority}</span>
                  </div>
                  <Link to={`/projects/${p._id}`} className="project-card-name">{p.name}</Link>
                  {p.description && <p className="project-card-desc">{p.description}</p>}
                </div>

                <div className="project-card-body">
                  <div className="project-card-progress">
                    <div className="flex-between text-sm text-muted">
                      <span>Progress</span><span>{progress}% ({p.completedCount}/{p.taskCount})</span>
                    </div>
                    <div className="project-progress-bar" style={{ marginTop: 6 }}>
                      <div className="progress-fill" style={{ width: `${progress}%`, background: p.color }} />
                    </div>
                  </div>

                  <div className="project-card-meta">
                    {p.deadline && (
                      <span className="text-sm text-muted">
                        📅 {format(new Date(p.deadline), 'MMM d, yyyy')}
                      </span>
                    )}
                    {p.overdueCount > 0 && (
                      <span className="text-sm overdue">⚠ {p.overdueCount} overdue</span>
                    )}
                  </div>

                  <div className="project-card-footer">
                    <div className="member-avatars">
                      {p.members?.slice(0, 4).map(m => (
                        <img key={m.user?._id} src={m.user?.avatar} alt={m.user?.name}
                          className="avatar avatar-sm member-avatar" title={m.user?.name} />
                      ))}
                      {p.members?.length > 4 && (
                        <div className="avatar-more avatar-sm">+{p.members.length - 4}</div>
                      )}
                    </div>
                    <div className="flex-center gap-4">
                      {isOwner && (
                        <>
                          <button className="btn btn-ghost btn-icon btn-sm"
                            onClick={() => { setEditProject(p); setShowModal(true); }} title="Edit">
                            ✏️
                          </button>
                          <button className="btn btn-ghost btn-icon btn-sm"
                            onClick={() => handleDelete(p._id)} title="Delete">
                            🗑️
                          </button>
                        </>
                      )}
                      <Link to={`/projects/${p._id}`} className="btn btn-secondary btn-sm">View →</Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <ProjectModal
          project={editProject}
          onClose={() => { setShowModal(false); setEditProject(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
