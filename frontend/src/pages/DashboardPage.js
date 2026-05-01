import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskAPI, projectAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { format, isAfter } from 'date-fns';
import TaskModal from '../components/TaskModal';
import './DashboardPage.css';

const StatCard = ({ label, value, color, icon }) => (
  <div className="stat-card" style={{ '--stat-color': color }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
    <img src="/logo.png" alt="" className="stat-watermark" />
  </div>
);

const statusLabel = { todo: 'STATUS', 'in-progress': 'In Progress', review: 'Review', done: 'Done' };
const priorityColor = { low: 'var(--green)', medium: 'var(--yellow)', high: 'var(--orange)', critical: 'var(--red)' };

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const loadData = async () => {
    try {
      const [statsRes, tasksRes, projRes] = await Promise.all([
        taskAPI.getDashboardStats(),
        taskAPI.getAll({ limit: 8 }),
        projectAPI.getAll()
      ]);
      setStats(statsRes.data.stats);
      setRecentTasks(tasksRes.data.tasks);
      setAllProjects(projRes.data.projects);
      setProjects(projRes.data.projects.slice(0, 5));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleTaskSave = () => {
    loadData(); // Reload everything to update dashboard stats
  };

  if (loading) return <div className="full-loader"><div className="spinner" /></div>;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">{greeting}, {user?.name.split(' ')[0]}</h1>
          <p className="page-subtitle">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex-center gap-8">
          <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>+ New Task</button>
          <Link to="/projects" className="btn btn-primary">+ New Project</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard label="Total Tasks" value={stats?.total ?? 0} color="var(--accent)"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>} />
        <StatCard label="In Progress" value={stats?.inProgress ?? 0} color="var(--cyan)"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>} />
        <StatCard label="Completed" value={stats?.done ?? 0} color="var(--green)"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>} />
        <StatCard label="Overdue" value={stats?.overdue ?? 0} color="var(--red)"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
        <StatCard label="My Open Tasks" value={stats?.myTasks ?? 0} color="var(--orange)"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
        <StatCard label="Projects" value={stats?.projects ?? 0} color="var(--pink)"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>} />
      </div>

      <div className="dashboard-body">
        {/* Recent Tasks */}
        <div className="card">
          <div className="flex-between" style={{ marginBottom: 16 }}>
            <h2 className="section-title">Recent Tasks</h2>
            <Link to="/tasks" className="btn btn-ghost btn-sm">View all →</Link>
          </div>
          {recentTasks.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <p>No tasks yet. Create a project to get started.</p>
            </div>
          ) : (
            <div className="task-list">
              {recentTasks.map(task => {
                const overdue = task.dueDate && task.status !== 'done' && isAfter(new Date(), new Date(task.dueDate));
                return (
                  <div key={task._id} className="task-row">
                    <div className="task-priority-dot" style={{ background: priorityColor[task.priority] }} />
                    <div className="task-info">
                      <div className="task-title">{task.title}</div>
                      <div className="task-meta">
                        <span className="tag">{task.project?.name}</span>
                        {task.dueDate && (
                          <span className={`text-sm ${overdue ? 'overdue' : 'text-muted'}`}>
                            {overdue ? '⚠ ' : ''}{format(new Date(task.dueDate), 'MMM d')}
                          </span>
                        )}
                      </div>
                    </div>
                    <span 
                      className={`badge badge-${task.status}`} 
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => { setEditTask(task); setShowTaskModal(true); }}
                    >
                      {statusLabel[task.status]}
                    </span>
                    {task.assignee && (
                      <img src={task.assignee.avatar} alt={task.assignee.name}
                        className="avatar avatar-sm" title={task.assignee.name} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Projects Overview */}
        <div className="card">
          <div className="flex-between" style={{ marginBottom: 16 }}>
            <h2 className="section-title">My Projects</h2>
            <Link to="/projects" className="btn btn-ghost btn-sm">View all →</Link>
          </div>
          {projects.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <p>No projects yet.</p>
            </div>
          ) : (
            <div className="project-list">
              {projects.map(p => {
                const progress = p.taskCount > 0 ? Math.round((p.completedCount / p.taskCount) * 100) : 0;
                return (
                  <Link key={p._id} to={`/projects/${p._id}`} className="project-row">
                    <div className="project-dot" style={{ background: p.color }} />
                    <div className="project-info">
                      <div className="project-name">{p.name}</div>
                      <div className="project-progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%`, background: p.color }} />
                      </div>
                    </div>
                    <div className="project-stat">
                      <span className="font-semibold">{progress}%</span>
                      <span className="text-sm text-muted">{p.completedCount}/{p.taskCount}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showTaskModal && (
        <TaskModal
          task={editTask}
          projects={allProjects}
          onClose={() => { setShowTaskModal(false); setEditTask(null); }}
          onSave={handleTaskSave}
        />
      )}
    </div>
  );
}
