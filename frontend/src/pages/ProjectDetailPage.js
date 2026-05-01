import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectAPI, taskAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { format, isAfter } from 'date-fns';
import TaskModal from '../components/TaskModal';
import './ProjectDetailPage.css';

const COLUMNS = [
  { key: 'todo', label: 'STATUS' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Done' }
];
const priorityColor = { low: 'var(--green)', medium: 'var(--yellow)', high: 'var(--orange)', critical: 'var(--red)' };

function AddMemberModal({ project, onClose, onAdd }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await projectAPI.addMember(project._id, { email, role });
      onAdd(data.project);
      toast.success('Member added!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h2 className="modal-title">Add Team Member</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="teammate@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('board');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        projectAPI.getOne(id),
        taskAPI.getAll({ project: id, limit: 200 })
      ]);
      setProject(projRes.data.project);
      setTasks(tasksRes.data.tasks);
    } catch (err) {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleTaskSave = (task, isEdit) => {
    if (isEdit) setTasks(ts => ts.map(t => t._id === task._id ? task : t));
    else setTasks(ts => [task, ...ts]);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskAPI.delete(taskId);
      setTasks(ts => ts.filter(t => t._id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const { data } = await taskAPI.update(taskId, { status: newStatus });
      setTasks(ts => ts.map(t => t._id === taskId ? data.task : t));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      const { data } = await projectAPI.removeMember(id, memberId);
      setProject(p => ({ ...p, members: data.project.members }));
      toast.success('Member removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  if (loading) return <div className="full-loader"><div className="spinner" /></div>;
  if (!project) return null;

  const isAdmin = project.members?.some(m => m.user?._id === user?._id && m.role === 'Admin');
  const tasksByStatus = COLUMNS.reduce((acc, col) => {
    acc[col.key] = tasks.filter(t => t.status === col.key);
    return acc;
  }, {});

  return (
    <div className="project-detail">
      {/* Header */}
      <div className="project-detail-header">
        <div>
          <div className="breadcrumb">
            <Link to="/projects" className="text-muted text-sm">Projects</Link>
            <span className="text-muted text-sm"> / </span>
            <span className="text-sm">{project.name}</span>
          </div>
          <h1 className="page-title" style={{ marginTop: 6 }}>
            <span className="project-dot-lg" style={{ background: project.color }} />
            {project.name}
          </h1>
          {project.description && <p className="page-subtitle">{project.description}</p>}
        </div>
        <div className="flex-center gap-8">
          {isAdmin && (
            <>
              <button className="btn btn-secondary" onClick={() => setShowMemberModal(true)}>+ Member</button>
              <button className="btn btn-primary" onClick={() => { setEditTask(null); setShowTaskModal(true); }}>+ Task</button>
            </>
          )}
          {!isAdmin && (
            <button className="btn btn-primary" onClick={() => { setEditTask(null); setShowTaskModal(true); }}>+ Task</button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['board', 'list', 'members'].map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'members' && <span className="tab-count">{project.members?.length}</span>}
          </button>
        ))}
      </div>

      {/* Board View */}
      {activeTab === 'board' && (
        <div className="kanban-board">
          {COLUMNS.map(col => (
            <div key={col.key} className="kanban-col">
              <div className="kanban-col-header">
                <span className="kanban-col-title">{col.label}</span>
                <span className="kanban-count">{tasksByStatus[col.key].length}</span>
              </div>
              <div className="kanban-tasks">
                {tasksByStatus[col.key].map(task => {
                  const overdue = task.dueDate && task.status !== 'done' && isAfter(new Date(), new Date(task.dueDate));
                  return (
                    <div key={task._id} className="kanban-card">
                      <div className="kanban-card-priority" style={{ background: priorityColor[task.priority] }} />
                      <div className="kanban-card-title">{task.title}</div>
                      {task.description && <div className="kanban-card-desc">{task.description}</div>}
                      {task.tags?.length > 0 && (
                        <div className="kanban-tags">
                          {task.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                        </div>
                      )}
                      <div className="kanban-card-footer">
                        <div className="flex-center gap-4">
                          {task.dueDate && (
                            <span className={`text-sm ${overdue ? 'overdue' : 'text-muted'}`}>
                              {overdue ? '⚠ ' : '📅 '}{format(new Date(task.dueDate), 'MMM d')}
                            </span>
                          )}
                        </div>
                        <div className="flex-center gap-4">
                          {task.assignee && (
                            <img src={task.assignee.avatar} alt={task.assignee.name}
                              className="avatar avatar-sm" title={task.assignee.name} />
                          )}
                          <button className="btn btn-ghost btn-icon" style={{ fontSize: '0.75rem' }}
                            onClick={() => { setEditTask(task); setShowTaskModal(true); }}>✏️</button>
                          <button className="btn btn-ghost btn-icon" style={{ fontSize: '0.75rem' }}
                            onClick={() => handleDeleteTask(task._id)}>🗑️</button>
                        </div>
                      </div>
                      {/* Quick status change */}
                      <select className="status-quick-change"
                        value={task.status}
                        onChange={e => handleStatusChange(task._id, e.target.value)}>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  );
                })}
                {tasksByStatus[col.key].length === 0 && (
                  <div className="kanban-empty">No tasks</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {activeTab === 'list' && (
        <div className="card">
          {tasks.length === 0 ? (
            <div className="empty-state"><h3>No tasks yet</h3><p>Create your first task to get started.</p></div>
          ) : (
            <table className="task-table">
              <thead>
                <tr>
                  <th>Task</th><th>Status</th><th>Priority</th>
                  <th>Assignee</th><th>Due Date</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => {
                  const overdue = task.dueDate && task.status !== 'done' && isAfter(new Date(), new Date(task.dueDate));
                  return (
                    <tr key={task._id}>
                      <td>
                        <div className="task-title-cell">
                          <div className="task-priority-dot" style={{ background: priorityColor[task.priority] }} />
                          <span>{task.title}</span>
                        </div>
                      </td>
                      <td>
                        <span 
                          className={`badge badge-${task.status}`}
                          style={{ cursor: 'pointer', userSelect: 'none' }}
                          onClick={() => { setEditTask(task); setShowTaskModal(true); }}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td><span className={`badge badge-${task.priority}`}>{task.priority}</span></td>
                      <td>
                        {task.assignee ? (
                          <div className="flex-center gap-8">
                            <img src={task.assignee.avatar} alt={task.assignee.name} className="avatar avatar-sm" />
                            <span className="text-sm">{task.assignee.name}</span>
                          </div>
                        ) : <span className="text-muted text-sm">—</span>}
                      </td>
                      <td>
                        {task.dueDate
                          ? <span className={overdue ? 'overdue text-sm' : 'text-sm text-muted'}>
                              {overdue && '⚠ '}{format(new Date(task.dueDate), 'MMM d, yyyy')}
                            </span>
                          : <span className="text-muted text-sm">—</span>
                        }
                      </td>
                      <td>
                        <div className="flex-center gap-4">
                          <button className="btn btn-ghost btn-icon btn-sm"
                            onClick={() => { setEditTask(task); setShowTaskModal(true); }}>✏️</button>
                          <button className="btn btn-ghost btn-icon btn-sm"
                            onClick={() => handleDeleteTask(task._id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Members View */}
      {activeTab === 'members' && (
        <div className="card" style={{ maxWidth: 600 }}>
          <div className="member-list">
            {project.members?.map(m => (
              <div key={m.user?._id} className="member-row">
                <img src={m.user?.avatar} alt={m.user?.name} className="avatar" />
                <div className="member-info">
                  <div className="font-semibold">{m.user?.name}</div>
                  <div className="text-sm text-muted">{m.user?.email}</div>
                </div>
                <span className={`badge badge-${m.role.toLowerCase()}`}>{m.role}</span>
                {isAdmin && m.user?._id !== user?._id && project.owner !== m.user?._id && (
                  <button className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveMember(m.user?._id)}>Remove</button>
                )}
              </div>
            ))}
          </div>
          {isAdmin && (
            <button className="btn btn-secondary" style={{ marginTop: 16 }}
              onClick={() => setShowMemberModal(true)}>+ Add Member</button>
          )}
        </div>
      )}

      {showTaskModal && (
        <TaskModal
          task={editTask}
          project={project}
          onClose={() => { setShowTaskModal(false); setEditTask(null); }}
          onSave={handleTaskSave}
        />
      )}
      {showMemberModal && (
        <AddMemberModal
          project={project}
          onClose={() => setShowMemberModal(false)}
          onAdd={p => setProject(prev => ({ ...prev, members: p.members }))}
        />
      )}
    </div>
  );
}
