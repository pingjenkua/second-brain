'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{ title: string; description: string; priority: 'high' | 'medium' | 'low'; status: 'pending' | 'in-progress' | 'completed'; dueDate: string }>({ title: '', description: '', priority: 'medium', status: 'pending', dueDate: '' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    setTasks(data.reverse());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
    });

    setForm({ title: '', description: '', priority: 'medium', status: 'pending', dueDate: '' });
    setShowForm(false);
    setEditingId(null);
    fetchTasks();
  };

  const handleEdit = (t: Task) => {
    setForm({ title: t.title, description: t.description, priority: t.priority, status: t.status, dueDate: t.dueDate || '' });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this task?')) {
      await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
      fetchTasks();
    }
  };

  const toggleStatus = async (t: Task) => {
    const newStatus = t.status === 'completed' ? 'pending' : 'completed';
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...t, status: newStatus }),
    });
    fetchTasks();
  };

  const filteredTasks = tasks.filter(t => filter === 'all' || t.status === filter);

  const pendingTasks = filteredTasks.filter(t => t.status !== 'completed');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  const priorityColor = (p: string) => {
    if (p === 'high') return 'text-red-400';
    if (p === 'medium') return 'text-yellow-400';
    return 'text-zinc-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">✅ Tasks</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: '', description: '', priority: 'medium', status: 'pending', dueDate: '' }); }}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Task'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
          <div>
            <label className="block text-zinc-400 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-zinc-400 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white h-24"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-400 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value as any })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as any })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>
          <button type="submit" className="bg-white text-black px-6 py-2 rounded-lg font-medium">
            {editingId ? 'Update' : 'Save'} Task
          </button>
        </form>
      )}

      <div className="flex gap-2">
        {['all', 'pending', 'in-progress', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg capitalize ${filter === f ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-zinc-400'}`}
          >
            {f.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Pending Tasks */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-zinc-400">Pending ({pendingTasks.length})</h2>
        {pendingTasks.length === 0 ? (
          <p className="text-zinc-500">No pending tasks 🎉</p>
        ) : (
          pendingTasks.map(t => (
            <div key={t.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
              <button
                onClick={() => toggleStatus(t)}
                className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${t.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-zinc-600 hover:border-zinc-400'}`}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${priorityColor(t.priority)}`}>[{t.priority.toUpperCase()}]</span>
                  <span className={t.status === 'completed' ? 'line-through text-zinc-500' : ''}>{t.title}</span>
                </div>
                {t.description && <p className="text-zinc-500 text-sm mt-1">{t.description}</p>}
                {t.dueDate && <p className="text-zinc-500 text-sm">Due: {t.dueDate}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(t)} className="text-zinc-400 hover:text-white">Edit</button>
                <button onClick={() => handleDelete(t.id)} className="text-zinc-400 hover:text-red-400">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-3 mt-8">
          <h2 className="text-xl font-semibold text-zinc-400">Completed ({completedTasks.length})</h2>
          {completedTasks.map(t => (
            <div key={t.id} className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50 flex items-center gap-4 opacity-60">
              <button
                onClick={() => toggleStatus(t)}
                className="w-6 h-6 rounded-full border-2 bg-green-500 border-green-500 flex-shrink-0"
              />
              <div className="flex-1">
                <span className="line-through text-zinc-500">{t.title}</span>
              </div>
              <button onClick={() => handleDelete(t.id)} className="text-zinc-500 hover:text-red-400">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
