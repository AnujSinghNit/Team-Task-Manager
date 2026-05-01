import React, { useState, useEffect } from 'react';
import { taskAPI, projectAPI } from '../utils/api';
import { format, isAfter } from 'date-fns';
import toast from 'react-hot-toast';
import TaskModal from '../components/TaskModal';
import './TasksPage.css';

const priorityColor = { low: 'var(--green)', medium: 'var(--yellow)', high: 'var(--orange)', critical: 'var(--red)' };

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ project: '', status: '', priority: '', search: '' });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    Promise.all([
      taskAPI.getAll({ limit: 200 }),
      projectAPI.getAll()
    ]).then(([tr, pr]) => {
      setTasks(tr.data.tasks);
      setProjects(pr.data.projects);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleTaskSave = (task, isEdit) => {
    if (isEdit) setTasks(ts => ts.map(t => t._id === task._id ? task : t));
    else setTasks(ts => [task, ...ts]);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const { data } = await taskAPI.update(taskId, { status: newStatus });
      setTasks(ts => ts.map(t => t._id === taskId ? data.task : t));
    } catch { toast.error('Failed to update status'); }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskAPI.delete(taskId);
      setTasks(ts => ts.filter(t => t._id !== taskId));
      toast.success('Task deleted');
    } catch { toast.error('Failed to delete task'); }
  };

  const filtered = tasks.filter(t => {
    if (filters.project && t.project?._id !== filters.project) return false;
    if (filters.status && t.status !== filters.status) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const overdueTasks = filtered.filter(t => t.dueDate && t.status !== 'done' && isAfter(new Date(), new Date(t.dueDate)));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Tasks</h1>
          <p className="page-subtitle">{filtered.length} task{filtered.length !== 1 ? 's' : ''}
            {overdueTasks.length > 0 && <span className="overdue"> · {overdueTasks.length} overdue</span>}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditTask(null); setShowTaskModal(true); }}>
          + New Task
        </button>
      </div>

      {/* Filters */}
      <div className="task-filters">
        <input className="form-input" placeholder="Search tasks..."
          value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
        <select className="form-select" value={filters.project}
          onChange={e => setFilters(f => ({ ...f, project: e.target.value }))}>
          <option value="">All Projects</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <select className="form-select" value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
          <option value="">All Statuses</option>
          <option value="todo">STATUS</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
        <select className="form-select" value={filters.priority}
          onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}>
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        {(filters.project || filters.status || filters.priority || filters.search) && (
          <button className="btn btn-ghost btn-sm"
            onClick={() => setFilters({ project: '', status: '', priority: '', search: '' })}>
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="full-loader" style={{ height: 200 }}><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <h3>No tasks found</h3>
          <p>Try adjusting your filters or click "+ New Task" to create one.</p>
        </div>
      ) : (
        <div className="tasks-table-wrap card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="full-task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(task => {
                const overdue = task.dueDate && task.status !== 'done' && isAfter(new Date(), new Date(task.dueDate));
                return (
                  <tr key={task._id} className={task.status === 'done' ? 'task-done-row' : ''}>
                    <td>
                      <div className="flex-center gap-8">
                        <div className="task-priority-dot" style={{ background: priorityColor[task.priority] }} />
                        <span 
                          className={task.status === 'done' ? 'task-done-text' : ''}
                          style={{ cursor: 'pointer' }}
                          title="Click to edit"
                          onClick={() => { setEditTask(task); setShowTaskModal(true); }}
                        >
                          {task.title}
                        </span>
                      </div>
                    </td>
                    <td>
                      {task.project && (
                        <span className="tag" style={{ borderColor: task.project.color }}>
                          {task.project.name}
                        </span>
                      )}
                    </td>
                    <td>
                      <select className="status-select"
                        value={task.status}
                        onChange={e => handleStatusChange(task._id, e.target.value)}>
                        <option value="todo">STATUS</option>
                        <option value="in-progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                      </select>
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
                        <button className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(task._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showTaskModal && (
        <TaskModal
          task={editTask}
          projects={projects}
          onClose={() => { setShowTaskModal(false); setEditTask(null); }}
          onSave={handleTaskSave}
        />
      )}
    </div>
  );
}
